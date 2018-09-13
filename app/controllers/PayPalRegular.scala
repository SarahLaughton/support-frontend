
package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import io.circe.syntax._
import monitoring.SafeLogger
import monitoring.SafeLogger._
import play.api.libs.circe.Circe
import play.api.mvc._

import services.paypal.PayPalBillingDetails.codec
import services.paypal.{PayPalBillingDetails, PayPalNvpServiceProvider, Token}
import services.{PayPalNvpService, TestUserService}
import admin.{Settings, SettingsProvider}

import scala.concurrent.ExecutionContext

class PayPalRegular(
    actionBuilders: CustomActionBuilders,
    assets: AssetsResolver,
    payPalNvpServiceProvider: PayPalNvpServiceProvider,
    testUsers: TestUserService,
    components: ControllerComponents,
    settingsProvider: SettingsProvider
)(implicit val ec: ExecutionContext) extends AbstractController(components) with Circe {

  import actionBuilders._

  implicit val a: AssetsResolver = assets
  implicit val s: Settings = settingsProvider.settings

  // Sets up a payment by contacting PayPal, returns the token as JSON.
  def setupPayment: Action[PayPalBillingDetails] = maybeAuthenticatedAction().async(circe.json[PayPalBillingDetails]) { implicit request =>
    val paypalBillingDetails = request.body
    withPaypalServiceForRequest(request) { service =>
      service.retrieveToken(
        returnUrl = routes.PayPalRegular.returnUrl().absoluteURL(secure = true),
        cancelUrl = routes.PayPalRegular.cancelUrl().absoluteURL(secure = true)
      )(paypalBillingDetails)
    }.map { response =>
      Ok(Token(response).asJson)
    }
  }

  def createAgreement: Action[Token] = maybeAuthenticatedAction().async(circe.json[Token]) { implicit request =>
    withPaypalServiceForRequest(request) { service =>
      service.createBillingAgreement(request.body)
    }.map(token => Ok(Token(token).asJson))
  }

  private def withPaypalServiceForRequest[T](request: CustomActionBuilders.OptionalAuthRequest[_])(fn: PayPalNvpService => T): T = {
    val isTestUser = testUsers.isTestUser(request)
    val service = payPalNvpServiceProvider.forUser(isTestUser)
    fn(service)
  }

  // The endpoint corresponding to the PayPal return url, hit if the user is
  // redirected and needs to come back.
  def returnUrl: Action[AnyContent] = PrivateAction { implicit request =>
    SafeLogger.error(scrub"User hit the PayPal returnUrl.")
    Ok(views.html.main(
      "Support the Guardian | PayPal Error",
      "paypal-error-page",
      "payPalErrorPage.js",
      "payPalErrorPageStyles.css"
    ))
  }

  // The endpoint corresponding to the PayPal cancel url, hit if the user is
  // redirected and the payment fails.
  def cancelUrl: Action[AnyContent] = PrivateAction { implicit request =>
    SafeLogger.error(scrub"User hit the PayPal cancelUrl, something went wrong.")
    Ok(views.html.main(
      "Support the Guardian | PayPal Error",
      "paypal-error-page",
      "payPalErrorPage.js",
      "payPalErrorPageStyles.css"
    ))
  }
}
