using System.Text;

namespace API.Infrastructure.Account {

    public static class ResetPasswordTemplate {

        public static string GetHtmlString() {

            var sb = new StringBuilder();

            sb.Append(@"
                <html>
                    <body>
                        <div id='wrapper'>
                            <div class='group'>
                                <div class='text lower'>Hello [displayName],</div>
                            </div>
                            <div class='group'>
                                <div class='text lower'>We sent you this</div>
                                <div class='text lower'>email because</div>
                            </div>
                            <div class='group'>
                                <div class='text upper'>YOU FORGOT</div>
                                <div class='text upper'>YOUR PASSWORD</div>
                            </div>
                            <div class='group'>
                                <div class='text lower'>Never mind. Click on the button</div>
                                <div class='text lower'>to set a new one.</div>
                            </div>
                            <a href='[callbackUrl]' class='button'>NEW PASSWORD</a>                            
                            <div id='social-media'>
                                <img src='[facebook]'/>
                                <img src='[youtube]'/>
                                <img src='[instagram]'/>
                            </div>
                            <div class='group' id='questions'>
                                <div class='text small'>Problems or questions? Call us at +30 26620 61400</div>
                                <div class='text small'>or email at info@corfucruises.com</div>
                                <div class='text small'>© Corfu Cruises 2023, Corfu - Greece</div>
                            </div>
                            <div class='group' id='info'>
                                <div class='text small'>If you didn't make this request, please disregard this email.</div>
                                <div class='text small'>This email will expire after 24 hours.</div>
                                <div class='text small'>Do not reply to this email.</div>
                            </div>
                        </div>
                    </body>
                </html>
            ");

            return sb.ToString();
        }

    }

}