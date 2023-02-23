using API.Infrastructure.Interfaces;

namespace API.Features.Registrars {

    public interface IRegistrarValidation : IRepository<Registrar> {

        int IsValid(RegistrarWriteDto registrar);

    }

}