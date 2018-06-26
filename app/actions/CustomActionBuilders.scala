package actions

import com.gu.identity.play.AuthenticatedIdUser
import com.gu.identity.play.AuthenticatedIdUser.Provider
import com.netaporter.uri.dsl._
import play.api.mvc.Results._
import play.api.mvc.Security.{AuthenticatedBuilder, AuthenticatedRequest}
import play.api.mvc._
import play.filters.csrf._
import services.TestUserService
import utils.RequestCountry

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}

object CustomActionBuilders {
  type AuthRequest[A] = AuthenticatedRequest[A, AuthenticatedIdUser]
  type OptionalAuthRequest[A] = AuthenticatedRequest[A, Option[AuthenticatedIdUser]]
}

class CustomActionBuilders(
    authenticatedIdUserProvider: Provider,
    idWebAppUrl: String,
    supportUrl: String,
    testUsers: TestUserService,
    cc: ControllerComponents,
    addToken: CSRFAddToken,
    checkToken: CSRFCheck,
    csrfConfig: CSRFConfig
)(implicit private val ec: ExecutionContext) {

  import CustomActionBuilders._

  val membersIdentityClientId = "clientId" -> "members"

  val recurringIdentityClientId = "clientId" -> "recurringContributions"

  // Tells identity to send users back to the checkout immediately after sign-up.
  private val idSkipConfirmation: (String, String) = "skipConfirmation" -> "true"
  // Prevents the identity validation email sending users back to our checkout.
  private val idSkipValidationReturn: (String, String) = "skipValidationReturn" -> "true"

  private def idWebAppRegisterUrl(path: String, clientId: (String, String)): String =
    idWebAppUrl / "register" ? ("returnUrl" -> s"$supportUrl$path") & idSkipConfirmation & idSkipValidationReturn & clientId

  private def newSignInFlowIdWebAppRegisterUrl(path: String, clientId: (String, String)): String =
    idWebAppUrl / "signin/start" ? ("returnUrl" -> s"$supportUrl$path") & idSkipConfirmation & idSkipValidationReturn & clientId

  def chooseRegister(identityClientId: (String, String)): RequestHeader => Result = request => {
    SeeOther(idWebAppRegisterUrl(request.uri, identityClientId))
  }

  def newSignInFlowChooseRegister(identityClientId: (String, String)): RequestHeader => Result = request => {
    SeeOther(newSignInFlowIdWebAppRegisterUrl(request.uri, identityClientId))
  }

  private def maybeAuthenticated(onUnauthenticated: RequestHeader => Result): ActionBuilder[OptionalAuthRequest, AnyContent] =
    new AuthenticatedBuilder(authenticatedIdUserProvider.andThen(Some.apply), cc.parsers.defaultBodyParser, onUnauthenticated)

  private def authenticated(onUnauthenticated: RequestHeader => Result): ActionBuilder[AuthRequest, AnyContent] =
    new AuthenticatedBuilder(authenticatedIdUserProvider, cc.parsers.defaultBodyParser, onUnauthenticated)

  private def authenticatedTestUser(onUnauthenticated: RequestHeader => Result): ActionBuilder[AuthRequest, AnyContent] =
    new AuthenticatedBuilder(
      userinfo = authenticatedIdUserProvider.andThen(_.filter(user => testUsers.isTestUser(user.user.displayName))),
      defaultParser = cc.parsers.defaultBodyParser,
      onUnauthorized = onUnauthenticated
    )

  val PrivateAction = new PrivateActionBuilder(addToken, checkToken, csrfConfig, cc.parsers.defaultBodyParser, cc.executionContext)

  val AuthenticatedAction = (identityClientId: (String, String)) => PrivateAction andThen authenticated(chooseRegister(identityClientId))

  val SignInFlowAuthenticatedAction = (useNewSignIn: Boolean, clientId: (String, String)) =>
    if (useNewSignIn) {
      PrivateAction andThen authenticated(newSignInFlowChooseRegister(clientId))
    } else {
      AuthenticatedAction(clientId)
    }

  val AuthenticatedTestUserAction = (identityClientId: (String, String)) => PrivateAction andThen authenticatedTestUser(chooseRegister(identityClientId))

  val MaybeAuthenticatedAction = (identityClientId: (String, String)) => PrivateAction andThen maybeAuthenticated(chooseRegister(identityClientId))

  val CachedAction = new CachedAction(cc.parsers.defaultBodyParser, cc.executionContext)

  val NoCacheAction = new NoCacheAction(cc.parsers.defaultBodyParser, cc.executionContext)

  val GeoTargetedCachedAction = new CachedAction(
    cc.parsers.defaultBodyParser,
    cc.executionContext,
    List("Vary" -> RequestCountry.fastlyCountryHeader)
  )

}
