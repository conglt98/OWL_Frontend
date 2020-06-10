export const ruleInfoCodeSuggest = ['[1] Approve: User in white list', '[2] Reject: User in black list']

export const filterSuggest = ['AND', 'OR']

export const versionRuleSuggest = ['1.0', '2.0','3.0']

export const sources = [
  {sourceType:"internal",
  listSource:[]},
  {sourceType:"grpc",
  listSource:[]},
  {sourceType:"redis",
  listSource:[]},
]

export const sourcesOld = [
  {
    sourceType: "3",
    listSource: [
      {
        id: '1',
        name: 'domain_user',
        type: 'internal',
        url: 'http://localhost:8080',
        method: 'api',
        timeoutMs: '5000ms'
      }, {
        id: '2',
        name: 'domain_device',
        type: 'internal',
        url: 'http://localhost:8080',
        method: 'api',
        timeoutMs: '5000ms'
      }, {
        id: '3',
        name: 'domain_user_x',
        type: 'internal',
        url: 'http://localhost:8080',
        method: 'api',
        timeoutMs: '5000ms'
      }, {
        id: '4',
        name: 'domain_device_x',
        type: 'internal',
        url: 'http://localhost:8080',
        method: 'api',
        timeoutMs: '5000ms'
      }
    ]
  }, {
    sourceType: "REDIS",
    listSource: [
      {
        id: '1',
        name: 'domain_user',
        type: 'redis',
        url: 'http://localhost:8080',
        method: 'cache',
        timeoutMs: '5000ms'
      }, {
        id: '2',
        name: 'domain_device',
        type: 'redis',
        url: 'http://localhost:8080',
        method: 'cache',
        timeoutMs: '5000ms'
      }
    ]
  }
]