using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace API.Features.Nationalities {

    public class NationalitiesConfig : IEntityTypeConfiguration<Nationality> {

        public void Configure(EntityTypeBuilder<Nationality> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // FKs
            entity.Property(x => x.UserId).HasMaxLength(36).IsRequired(true);
            // Fields
            entity.Property(x => x.Description).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Code).HasMaxLength(10).IsRequired(true);
            entity.Property(x => x.IsActive).IsRequired(true);
            entity.Property(x => x.LastUpdate).HasMaxLength(19);
            // FK Constraints
            entity.HasOne(x => x.User).WithMany(x => x.Nationalities).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        }

    }

}