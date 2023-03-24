// ng build --output-path="release" --configuration=production-local

export const environment = {
    apiUrl: 'https://localhost:1701/api',
    url: 'https://localhost:1701',
    appName: 'Corfu Cruises',
    clientUrl: 'https://localhost:1701',
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
    cssUserSelect: 'none',
    marginsInPixels: 18,
    login: {
        username: 'john',
        email: 'johnsourvinos@hotmail.com',
        password: 'ec11fc8c16dx',
        noRobot: true
    },
    production: true
}
