const {getGoogleSheets, auth} = require('../Spreadsheets/authSpreadsheet')

async function formatRow(spreadsheetId){
  await getGoogleSheets().spreadsheets.batchUpdate({
    spreadsheetId,
    auth,
    resource: requests,
  });
}

let requests = {
  'requests': [
    {
      'repeatCell': {
        'cell': {
          'userEnteredFormat': {
            'backgroundColor': {
              'red': 1,
              'green': 1,
              'blue': 1
            },
            'textFormat': {
              'bold': false
            }
          }
        },
        'range': {
          'sheetId': 0,
          'startRowIndex': 1
        },
        'fields': 'userEnteredFormat(backgroundColor,textFormat)'
      }
    },
      {
          'addConditionalFormatRule': {
            'rule': {
              'booleanRule': {
                'condition': {
                  'type': 'CUSTOM_FORMULA',
                  'values': [
                    {
                      'userEnteredValue': '=NOT(ISBLANK($I2))'
                    }
                  ]
                },
                'format': {
                  'backgroundColor': {
                    'red': 0.72,
                    'green': 0.88,
                    'blue': 0.8
                  }
                }
              },
              'ranges': [
                {
                  'sheetId': 0,
                  'startRowIndex': 1,
                }
              ]
            }
          }
        },
    {
      'addConditionalFormatRule': {
        'rule': {
          'ranges': [
            {
              'sheetId': 0,
              'startRowIndex': 1,
            }
          ],
          'booleanRule': {
            'condition': {
              'type': 'CUSTOM_FORMULA',
              'values': [
                {
                  'userEnteredValue': '=NOT(ISBLANK($J2))'
                }
              ]
            },
            'format': {
              'backgroundColor': {
                'red': 0.87,
                'blue': 0.4,
                'green': 0.4
              }
            }
          }
        }
      }
    },
    {
      'autoResizeDimensions': {
        'dimensions': {
          'sheetId': 0,
          'dimension': 'COLUMNS',
          'startIndex': 7,
          'endIndex': 9
        }
      }
    }
   
  ]
};

module.exports = {formatRow}