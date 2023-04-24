using System;
using System.Globalization;

namespace API.Infrastructure.Helpers {

    public static class DateHelpers {

        public static string DateToISOString(DateTime date) {
            string day = "0" + date.Day.ToString();
            string month = "0" + date.Month.ToString();
            return date.Year.ToString() + "-" + month.Substring(month.Length - 2, 2) + "-" + day.Substring(day.Length - 2, 2);
        }

        public static string DateTimeToISOString(DateTime date) {
            string day = "0" + date.Day.ToString();
            string month = "0" + date.Month.ToString();
            string hour = "0" + date.Hour.ToString();
            string minutes = "0" + date.Minute.ToString();
            string seconds = "0" + date.Second.ToString();
            return date.Year.ToString() + "-" + month.Substring(month.Length - 2, 2) + "-" + day.Substring(day.Length - 2, 2) + " " +
                hour.Substring(hour.Length - 2, 2) + ":" + minutes.Substring(minutes.Length - 2, 2) + ":" + seconds.Substring(seconds.Length - 2, 2);
        }

        public static bool BeCorrectFormat(string date) {
            return DateTime.TryParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out _);
        }

        public static DateTime GetLocalDateTime() {
            return TimeZoneInfo.ConvertTimeBySystemTimeZoneId(DateTime.Now, "E. Europe Standard Time");
        }

        public static string GetTrimmedUnixTime() {
            string ms = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString();
            return ms.Substring(ms.Length - 6, 6);
        }

        public static string FormatDateStringToLocaleString(string date) {
            var year = date[..4];
            var month = date.Substring(5, 2);
            var day = date.Substring(8, 2);
            return day + "/" + month + "/" + year;
        }

    }

}
