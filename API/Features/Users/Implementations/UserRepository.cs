using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Options;

namespace API.Features.Users {

    public class UserRepository : IUserRepository {

        #region variables

        private readonly AppDbContext context;
        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;
        private readonly TestingEnvironment testingSettings;
        private readonly UserManager<UserExtended> userManager;

        #endregion

        public UserRepository(AppDbContext context, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> testingSettings, UserManager<UserExtended> userManager) {
            this.context = context;
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.userManager = userManager;
            this.testingSettings = testingSettings.Value;
        }

        public async Task<IEnumerable<UserListVM>> GetAsync() {
            var users = await userManager.Users
                .AsNoTracking()
                .OrderBy(o => o.UserName)
                .ToListAsync();
            return mapper.Map<IEnumerable<UserExtended>, IEnumerable<UserListVM>>(users);
        }

        public async Task<UserExtended> GetByIdAsync(string id) {
            return await userManager.Users
                .Include(x => x.Customer)
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task CreateAsync(UserExtended user, string password) {
            using var transaction = context.Database.BeginTransaction();
            var result = await userManager.CreateAsync(user, password);
            if (result.Succeeded) {
                await userManager.AddToRoleAsync(user, user.IsAdmin ? "Admin" : "User");
                DisposeOrCommit(transaction);
            } else {
                throw new CustomException() {
                    ResponseCode = 498
                };
            }
        }

        public async Task<bool> UpdateAsync(UserExtended x, UserUpdateDto user) {
            if (await UpdateUser(x, user)) {
                await UpdateUserRole(x);
                return true;
            } else {
                return false;
            }
        }

        public async Task<Response> DeleteAsync(UserExtended user) {
            using var transaction = context.Database.BeginTransaction();
            try {
                var result = await userManager.DeleteAsync(await userManager.FindByIdAsync(user.Id));
                if (result.Succeeded) {
                    DisposeOrCommit(transaction);
                    return new Response {
                        Code = 200,
                        Icon = Icons.Success.ToString(),
                        Message = ApiMessages.OK()
                    };
                } else {
                    throw new CustomException() {
                        ResponseCode = 491
                    };
                }
            } catch (Exception) {
                throw new CustomException { ResponseCode = 491 };
            }
        }

        private async Task<bool> IsAdmin() {
            var isUserAdmin = Task.Run(() => Infrastructure.Extensions.Identity.IsUserAdmin(httpContext));
            return await isUserAdmin;
        }

        private async Task<bool> UpdateUser(UserExtended x, UserUpdateDto user) {
            x.Displayname = user.Displayname;
            if (await IsAdmin()) {
                x.CustomerId = user.CustomerId == 0 ? null : user.CustomerId;
                x.UserName = user.Username;
                x.Email = user.Email;
                x.IsAdmin = user.IsAdmin;
                x.IsActive = user.IsActive;
            }
            var result = await userManager.UpdateAsync(x);
            return result.Succeeded;
        }

        private async Task UpdateUserRole(UserExtended user) {
            var roles = await userManager.GetRolesAsync(user);
            await userManager.RemoveFromRolesAsync(user, roles);
            await userManager.AddToRoleAsync(user, user.IsAdmin ? "admin" : "user");

        }

        private void DisposeOrCommit(IDbContextTransaction transaction) {
            if (testingSettings.IsTesting) {
                transaction.Dispose();
            } else {
                transaction.Commit();
            }
        }

    }

}