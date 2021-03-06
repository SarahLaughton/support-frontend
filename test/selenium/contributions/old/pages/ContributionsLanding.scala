package selenium.contributions.old.pages

import org.openqa.selenium.WebDriver
import org.scalatest.selenium.Page
import selenium.util.{Browser, Config}

case class ContributionsLanding(region: String)(implicit val webDriver: WebDriver) extends Page with Browser {

  // While the new contributions landing page test is running,
  // we just want Selenium to test the old page.
  val url = s"${Config.supportFrontendUrl}/$region"

  private val contributeButton = id("qa-contribute-button")

  private val contributePayPalButton = id("qa-contribute-paypal-button")

  private val oneOffButton = id("qa-one-off-toggle")

  private val otherAmountField = id("qa-payment-amount-input")

  def pageHasLoaded: Boolean = {
    pageHasElement(contributeButton)
    elementIsClickable(contributeButton)
  }

  def clickContribute: Unit = clickOn(contributeButton)

  def clickOneOff: Unit = clickOn(oneOffButton)

  def clickContributePayPalButton: Unit = clickOn(contributePayPalButton)

  def enterAmount(amount: Double): Unit = setValueSlowly(otherAmountField, amount.toString)

}
