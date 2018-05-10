package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import com.gu.i18n.CountryGroup._
import config.StringsConfig
import play.api.mvc._
import utils.RequestCountry._

import scala.concurrent.ExecutionContext

class Subscriptions(
    actionRefiners: CustomActionBuilders,
    val assets: AssetsResolver,
    components: ControllerComponents,
    stringsConfig: StringsConfig
)(implicit val ec: ExecutionContext) extends AbstractController(components) {

  import actionRefiners._

  implicit val ar = assets

  def subscribeGeoRedirect: Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>
    val redirectUrl = request.fastlyCountry match {
      case Some(UK) => "/uk/subscribe"
      case _ => "https://subscribe.theguardian.com"
    }

    Redirect(redirectUrl, request.queryString, status = FOUND)
  }

  def subscribeRedirect(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    // Country code is required here because it's a parameter in the route.
    // But we don't actually use it.
    Redirect("https://subscribe.theguardian.com", request.queryString, status = FOUND)
  }

  def subscriptionsLanding(): Action[AnyContent] = CachedAction() { implicit request =>
    Ok(views.html.main(
      title = "Support the Guardian | Get a Subscription",
      mainId = "subscriptions-landing-page",
      mainJsBundle = "subscriptionsLandingPage.js",
      description = Some(stringsConfig.subscriptionsLandingDescription)
    ))
  }

  def digitalProduct(): Action[AnyContent] = CachedAction() { implicit request =>
    Ok(views.html.main(
      title = "Support the Guardian | Get a Subscription",
      mainId = "digital-subscription-product-page",
      mainJsBundle = "digitalSubscriptionProductPage.js",
      description = Some(stringsConfig.subscriptionsLandingDescription)
    ))
  }
}
