# jsXmlParser
Converts an XML message to javascript object

This project aims to provide a solution for parsing xml into javascript objects quickly and without the need for a dom object.

## Example Usage
this is the xml being parsed in the following examples
```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<!DOCTYPE ship_notice>
<xmlDoc>
    <xmlId>02965</xmlId>
    <salesOrder id="6C1281B87">
        <orderID>6C1281B87</orderID>
        <orderSuffix>0</orderSuffix>
        <skuList>
            <skuNode>
                <entryID>00001</entryID>
                <quantityCancelled>4</quantityCancelled>
                <reason>IO</reason>
                <sku>CC3BDAA</sku>
            </skuNode>
        </skuList>
        <cartons>
            <carton>
                <cartonID>00020000000112465726</cartonID>
                <weight>3</weight>
                <rate>167</rate>
                <trackingNumber>92748999920876573010180923</trackingNumber>
                <shipmentTime>20150916120714</shipmentTime>
                <shipmentCarrier>MIV</shipmentCarrier>
                <skuList>
                    <skuNode>
                        <entryID>00001</entryID>
                        <quantityShipped>6</quantityShipped>
                        <sku>CC3BDAA</sku>
                    </skuNode>
                    <skuNode>
                        <entryID>00002</entryID>
                        <quantityShipped>8</quantityShipped>
                        <sku>DDD</sku>
                    </skuNode>
                </skuList>
            </carton>
        </cartons>
    </salesOrder>
</xmlDoc>
```

```
jsXmlParser.parseXml(xml);

{  
   "xmlDoc":{  
      "xmlId":"02965",
      "salesOrder": {  
        "id":"6C1281B87",
        "orderID":"6C1281B87",
        "orderSuffix":"0",
        "skuList":{  
           "skuNode": {                     // not an array by default as there is only a single object
                 "entryID":"00001",
                 "quantityCancelled":"4",
                 "reason":"IO",
                 "sku":"CC3BDAA"
           }
        },
        "cartons":{  
           "carton":{  
              "cartonID":"00020000000112465726",
              "weight":"3",
              "rate":"167",
              "trackingNumber":"92748999920876573010180923",
              "shipmentTime":"20150916120714",
              "shipmentCarrier":"MIV",
              "skuList":{  
                 "skuNode":[                // if there are multiple objects with same name, an array is created
                    {  
                       "entryID":"00001",
                       "quantityShipped":"6",
                       "sku":"CC3BDAA"
                    },
                    {  
                       "entryID":"00002",
                       "quantityShipped":"8",
                       "sku":"DDD"
                    }
                 ]
              }
           }
        }
     }
   }
}
```

If you want to specify which elements are arrays, you can do so by populating the jsXmlParser.arrayPaths variable
```
jsXmlParser.arrayPaths = ['xmlDoc.salesOrder', 'xmlDoc.salesOrder.skuList.skuNode'];
jsXmlParser.parseXml(xml);

{  
   "xmlDoc":{  
      "xmlId":"02965",
      "salesOrder":[  
         {  
            "id":"6C1281B87",
            "orderID":"6C1281B87",
            "orderSuffix":"0",
            "skuList":{  
               "skuNode":[                      // if we specify an array list path then the element will be converted
                  {                             // to an array even if there is only a single object
                     "entryID":"00001",
                     "quantityCancelled":"4",
                     "reason":"IO",
                     "sku":"CC3BDAA"
                  }
               ]
            },
            "cartons":{  
               "carton":{  
                  "cartonID":"00020000000112465726",
                  "weight":"3",
                  "rate":"167",
                  "trackingNumber":"92748999920876573010180923",
                  "shipmentTime":"20150916120714",
                  "shipmentCarrier":"MIV",
                  "skuList":{  
                     "skuNode":[  
                        {  
                           "entryID":"00001",
                           "quantityShipped":"6",
                           "sku":"CC3BDAA"
                        },
                        {  
                           "entryID":"00002",
                           "quantityShipped":"8",
                           "sku":"DDD"
                        }
                     ]
                  }
               }
            }
         }
      ]
   }
}
```
