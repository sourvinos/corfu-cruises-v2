using API.Infrastructure.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Features.Users {

    public interface IUserRepository {

        Task<IEnumerable<UserListVM>> GetAsync();
        Task<UserExtended> GetByIdAsync(string id);
        Task CreateAsync(UserExtended entity, string password);
        Task<bool> UpdateAsync(UserExtended x, UserUpdateDto user);
        Task<Response> DeleteAsync(UserExtended user);

    }

}