using System;
using System.Linq;

namespace API.Model.Tests.Infrastructure {

    public static class Helpers {

        public static string GetLongString() {

            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            var randomString = new string(Enumerable.Repeat(chars, 129).Select(s => s[random.Next(s.Length)]).ToArray());

            return randomString;

        }

    }

}