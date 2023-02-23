using System;
using System.Globalization;
using System.Text.RegularExpressions;

namespace API.Infrastructure.Helpers {

    public static class EmailHelpers {

        public static bool BeValidEmailAddress(string email) {
            return IsValidEmail(email);
        }

        public static bool BeEmptyOrValidEmailAddress(string email) {
            return string.IsNullOrWhiteSpace(email) || IsValidEmail(email);
        }

        private static bool IsValidEmail(string email) {
            try {
                email = Regex.Replace(email, "(@)(.+)$", DomainMapper, RegexOptions.None, TimeSpan.FromMilliseconds(200));
                static string DomainMapper(Match match) {
                    var idn = new IdnMapping();
                    string domainName = idn.GetAscii(match.Groups[2].Value);
                    return match.Groups[1].Value + domainName;
                }
            } catch (RegexMatchTimeoutException) {
                return false;
            } catch (ArgumentException) {
                return false;
            }
            try {
                return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
            } catch (RegexMatchTimeoutException) {
                return false;
            }
        }

    }

}
