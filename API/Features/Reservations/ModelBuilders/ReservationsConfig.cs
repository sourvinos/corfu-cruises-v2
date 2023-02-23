using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Features.Reservations {

    internal class ReservationsConfig : IEntityTypeConfiguration<Reservation> {

        public void Configure(EntityTypeBuilder<Reservation> entity) {
            // PK
            entity.Property(x => x.ReservationId).IsFixedLength().HasMaxLength(36).IsRequired(true);
            // FKs
            entity.Property(x => x.CustomerId).IsRequired(true);
            entity.Property(x => x.DestinationId).IsRequired(true);
            entity.Property(x => x.PickupPointId).IsRequired(true);
            entity.Property(x => x.UserId).HasMaxLength(36).IsRequired(true);
            // Fields
            entity.Property(x => x.Date).HasColumnType("date").IsRequired(true);
            entity.Property(x => x.RefNo).HasDefaultValue("").HasMaxLength(11);
            entity.Property(x => x.TicketNo).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Adults).HasDefaultValue(0).IsRequired(true);
            entity.Property(x => x.Kids).HasDefaultValue(0).IsRequired(true);
            entity.Property(x => x.Free).HasDefaultValue(0).IsRequired(true);
            entity.Property(x => x.TotalPersons).HasComputedColumnSql("((`Adults` + `Kids`) + `Free`)", stored: false);
            entity.Property(x => x.Email).HasDefaultValue("").HasMaxLength(128);
            entity.Property(x => x.Phones).HasDefaultValue("").HasMaxLength(128);
            entity.Property(x => x.Remarks).HasDefaultValue("").HasMaxLength(128);
            entity.Property(x => x.LastUpdate).HasMaxLength(19);
            // FK Constraints
            entity.HasOne(x => x.Customer).WithMany(x => x.Reservations).HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Destination).WithMany(x => x.Reservations).HasForeignKey(x => x.DestinationId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Driver).WithMany(x => x.Reservations).HasForeignKey(x => x.DriverId).IsRequired(false).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.PickupPoint).WithMany(x => x.Reservations).HasForeignKey(x => x.PickupPointId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Port).WithMany(x => x.Reservations).HasForeignKey(x => x.PortId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Ship).WithMany(x => x.Reservations).HasForeignKey(x => x.ShipId).IsRequired(false).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.User).WithMany(x => x.Reservations).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        }

    }

}