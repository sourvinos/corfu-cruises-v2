using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace API.Features.ShipCrews {

    internal class ShipCrewsConfig : IEntityTypeConfiguration<ShipCrew> {

        public void Configure(EntityTypeBuilder<ShipCrew> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // FKs
            entity.Property(x => x.GenderId).IsRequired(true);
            entity.Property(x => x.NationalityId).IsRequired(true);
            entity.Property(x => x.OccupantId).HasDefaultValue(1);
            entity.Property(x => x.ShipId).IsRequired(true);
            entity.Property(x => x.UserId).HasMaxLength(36).IsRequired(true);
            // Fields
            entity.Property(x => x.Lastname).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Firstname).HasMaxLength(128).IsRequired(true);
            entity.Property(p => p.Birthdate).HasColumnType("date").IsRequired(true);
            entity.Property(x => x.IsActive);
            entity.Property(x => x.LastUpdate).HasMaxLength(19);
            // FK Constraints
            entity.HasOne(x => x.Gender).WithMany(x => x.ShipCrews).HasForeignKey(x => x.GenderId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Nationality).WithMany(x => x.ShipCrews).HasForeignKey(x => x.NationalityId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Ship).WithMany(x => x.ShipCrews).HasForeignKey(x => x.ShipId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.User).WithMany(x => x.ShipCrews).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        }

    }

}