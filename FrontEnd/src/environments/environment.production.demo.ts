// ng build --output-path="release" --configuration=production-demo

export const environment = {
    apiUrl: 'http://spacetravels-001-site1.btempurl.com/api',
    url: 'http://spacetravels-001-site1.btempurl.com',
    appName: 'Corfu Cruises',
    clientUrl: 'http://spacetravels-001-site1.btempurl.com',
    defaultLanguage: 'en-GB',
    defaultTheme: 'light',
    emailFooter: {
        lineA: 'Problems or questions? Call us at +30 26620 61400',
        lineB: 'or email at info@corfucruises.com',
        lineC: '© Corfu Cruises 2023, Corfu - Greece'
    },
    menuIconDirectory: 'assets/images/menu/',
    featuresIconDirectory: 'assets/images/features/',
    criteriaIconDirectory: 'assets/images/criteria/',
    stopOrdersIconDirectory: 'assets/images/stopOrders/',
    nationalitiesIconDirectory: 'assets/images/nationalities/',
    cssUserSelect: 'auto',
    marginsInPixels: 18,
    login: {
        username: '',
        email: '',
        password: '',
        noRobot: false
    },
    production: true
}
