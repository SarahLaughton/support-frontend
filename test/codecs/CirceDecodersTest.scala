package codecs

import admin._
import cats.syntax.either._
import codecs.CirceDecoders._
import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.support.workers.DirectDebitPaymentFields
import io.circe.parser.parse
import io.circe.parser._
import io.circe.syntax._
import io.circe.{Json, JsonObject}
import models.CheckBankAccountDetails
import SwitchState._
import models.ZuoraCatalog._
import ophan.thrift.componentEvent.ComponentType.{AcquisitionsEpic, EnumUnknownComponentType}
import ophan.thrift.event.AbTest
import ophan.thrift.event.AcquisitionSource.GuardianWeb
import org.scalatest.{MustMatchers, WordSpec}
import org.scalatest.EitherValues._
import io.circe.generic.auto._

class CirceDecodersTest extends WordSpec with MustMatchers {

  "AbTestDecoder" should {
    "decode json" in {
      val json =
        """
          |{
          |  "name":"test_1",
          |  "variant":"variant_34"
          |}
        """
          .stripMargin

      val parsedJson = parse(json).toOption.get

      val abtest: AbTest = abTestDecoder.decodeJson(parsedJson).right.get

      abtest.name mustBe "test_1"
      abtest.variant mustBe "variant_34"
    }
  }

  "CheckBankAccountDecoder" should {
    "decode json" in {
      val json =
        """
          |{
          |   "sortCode": "121212",
          |   "accountNumber": "12121212"
          |}
        """.stripMargin

      val parsedJson = parse(json).toOption.get

      val checkBankAccountData: CheckBankAccountDetails = CheckBankAccountDetails.codec.decodeJson(parsedJson).right.get

      checkBankAccountData.sortCode.value mustBe "121212"
      checkBankAccountData.accountNumber.value mustBe "12121212"
    }
  }

  "ZuoraCatalog" should {
    "decode json" in {

      val json =
        """
          |{
          |  "products": [
          |    {
          |      "productRatePlans": [
          |        {
          |          "id": "t-15",
          |          "productRatePlanCharges": [
          |            {
          |              "pricing": [
          |                {
          |                  "currency": "GBP",
          |                  "price": 12.34
          |                }
          |              ]
          |            }
          |          ]
          |        }
          |      ]
          |    }
          |  ]
          |}
        """.stripMargin

      val catalog = parse(json).toOption.get.as[ZuoraCatalog].toOption.get

      catalog.products.length mustBe 1

      val plan = catalog.products.head.productRatePlans.head

      plan.name mustBe None
      plan.id mustBe "t-15"
      plan.productRatePlanCharges.head.pricing.head.currency mustBe "GBP"
      plan.productRatePlanCharges.head.pricing.head.price mustBe 12.34
    }
  }

  "SwitchStateDecoder" should {
    "decode json" in {
      decode[SwitchState]("\"On\"").right.value mustBe On
      decode[SwitchState]("\"Off\"").right.value mustBe Off
    }

  }
  "SwitchStateEncoder" should {
    "encode json" in {
      val on: SwitchState = On
      on.asJson mustBe Json.fromString("On")

      val off: SwitchState = Off
      off.asJson mustBe Json.fromString("Off")
    }
  }

  "SegmentDecoder" should {
    "decode json" in {
      decode[Segment]("\"Perc0\"").right.value mustBe Segment.Perc0
      decode[Segment]("\"Perc50\"").right.value mustBe Segment.Perc50
      decode[Segment]("\"Anything else\"").right.value mustBe Segment.Perc50
    }
  }

  "SegmentEncoder" should {
    "encode json" in {
      val perc0: Segment = Segment.Perc0
      perc0.asJson mustBe Json.fromString("Perc0")

      val perc50: Segment = Segment.Perc50
      perc50.asJson mustBe Json.fromString("Perc50")
    }
  }

  "SettingsDecoder" should {
    "decode json" in {
      val json =
        """{
          |  "switches": {
          |    "oneOffPaymentMethods": {
          |      "stripe": "On",
          |      "payPal": "On"
          |    },
          |    "recurringPaymentMethods": {
          |      "stripe": "On",
          |      "payPal": "On",
          |      "directDebit": "On"
          |    },
          |    "experiments": {
          |      "newFlow": {
          |        "name": "newFlow",
          |        "description": "Redesign of the payment flow UI",
          |        "state": "On"
          |      }
          |    },
          |    "optimize": "Off"
          |  }
          |}""".stripMargin

      val settings = AllSettings(
        Switches(
          oneOffPaymentMethods = PaymentMethodsSwitch(
            stripe = On,
            payPal = On,
            directDebit = None
          ),
          recurringPaymentMethods = PaymentMethodsSwitch(
            stripe = On,
            payPal = On,
            directDebit = Some(On)
          ),
          experiments = Map(
            "newFlow" -> ExperimentSwitch(
              name = "newFlow",
              description = "Redesign of the payment flow UI",
              state = On
            )
          ),
          optimize = Off
        )
      )

      decode[AllSettings](json).right.value mustBe settings
    }
  }
}

