export const eventsData = [
  // {
  //   "id": 1,
  //   "name": "tpe_validate",
  //   "client": "tpe",
  //   "type": 1,
  //   "createdAt": "2018-06-12T19:30",
  //   "status": "ON",
  //   "data": [
  //     {
  //       "id": 1,
  //       "createdAt": 1585281846000,
  //       "name": "domain_user",
  //       "description": "Domain for user",
  //       "sourceId": 1,
  //       "status": 1,
  //       "dataDefinitions": [
  //         {
  //           "id": 2,
  //           "createdAt": 20200330073718,
  //           "name": "A30 Check",
  //           "source": "ZALO_A30",
  //           "dataType": "JSON",
  //           "dataDef": "[{\"name\": \"userID\",\"type\": \"string\"},{\"name\": \"isA30\",\"type\": \"boolean\"}]",
  //           "accumulationKeys": [
  //             {
  //               "id": 1,
  //               "createdAt": 20200330073800,
  //               "name": "is_a30_key",
  //               "filter": "[[\"isA30 == false\"]]",
  //               "keyFormat": "zpi|user_a30_nonactive:#staticCfg(campaign.zpi.a30.month)",
  //               "cacheType": "SET",
  //               "elementType": "RAW",
  //               "elementValue": "${userID}",
  //               "description": null,
  //               "expire": -1,
  //               "active": true
  //             }
  //           ]
  //         }
  //       ],
  //       "listProfiles": [
  //         {
  //           "id": "1",
  //           "profile": "check_whitelist_blacklist",
  //           "filter": "AND",
  //           "conditions": [
  //             {
  //               "id": "e215cd3-d23-8068-ca8-faa3447d8c14",
  //               "operation": "compare",
  //               "field": "userID",
  //               "fieldType": "long",
  //               "operator": ">",
  //               "value": "0"
  //             }
  //           ],
  //           "listTiers": [
  //             {
  //               "id": "c15d1d-b782-6c0a-655-d63d5d8b3116",
  //               "tier": "user in whitelist",
  //               "priority": "1",
  //               "decision": "APPROVE",
  //               "filter": "AND",
  //               "listRules": [
  //                 {
  //                   "id": "8bbdc34-e6bb-abb-f3b6-b3ce54e6",
  //                   "infoCode": "[1] Approve: User in white list",
  //                   "filter": "AND",
  //                   "sourceType": "GRPC",
  //                   "maintenanceStart": "2018-06-12T19:30",
  //                   "maintenanceEnd": "2018-06-12T19:30",
  //                   "timeInterval": "30m",
  //                   "status": "ON",
  //                   "version": "2.0",
  //                   "sourceChoose": [
  //                     {
  //                       "id": "1",
  //                       "name": "domain_user",
  //                       "type": "internal",
  //                       "url": "http://localhost:8080",
  //                       "method": "api",
  //                       "timeout": "5000ms",
  //                       "isChoose": true
  //                     }
  //                   ],
  //                   "ruleConditions": [
  //                     {
  //                       "id": "e8f34a2-f213-4c7-148e-f542735f68f",
  //                       "operation": "compare",
  //                       "field": "isWhitelist",
  //                       "fieldType": "boolean",
  //                       "operator": "=",
  //                       "value": "TRUE"
  //                     }
  //                   ]
  //                 }
  //               ]
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // }
]

export default eventsData
