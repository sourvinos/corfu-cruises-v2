namespace API.Features.Manifest {

    public interface IManifestRepository {

        ManifestFinalVM Get(string date, int destinationId, int shipId, int[] portIds);

    }

}