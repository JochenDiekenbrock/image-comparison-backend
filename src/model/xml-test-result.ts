/*
{
  "VisualRegressionTest": {
    "$": {
      "name": "pricingPowerFilter",
      "imageName": "pricing-power-filter",
      "result": "false",
      "mode": "TEST"
    },
    "ScreenShot": [
      {
        "$": {
          "id": "pricingPowerFilter",
          "success": "false",
          "expected": "pricingPowerFilter"
        },
        "BaseFile": [
          "pricingPowerFilter-chrome-1280x1024.png"
        ],
        "CurrFile": [
          {
            "_": "actual/pricingPowerFilter-chrome-1280x1024.png",
            "$": {
              "time": "7.9.2018 18:28"
            }
          }
        ],
        "DiffFile": [
          "diff/pricingPowerFilter-chrome-1280x1024.png"
        ]
      }
    ]
  }
}
 */
export interface XmlTestResult {
    VisualRegressionTest: {
        $: {
            name: string;
            imageName: string;
            result: string;
            mode: string;
        };
        ScreenShot: Array<{
            $: { id: string; success: string; expected: string; };
            BaseFile: string[];
            DiffFile: string[];
            CurrFile: Array<{ _: string; $: { time: string } }>;
        }>;
    };
}
