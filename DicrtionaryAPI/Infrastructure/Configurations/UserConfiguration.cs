using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApi.Core.Model;

namespace WebApi.Infrastructure.Configurations
{
    public class UserConfiguration: IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder){
            builder.HasKey(u => u.Id);
            builder.HasMany(u => u.Lessons)
                .WithOne(l => l.User)
                .HasForeignKey(l => l.UserId);
            builder.Property(u => u.Login).IsRequired();
            builder.Property(u => u.Email).IsRequired();
            builder.HasIndex(u => u.Email).IsUnique();
            builder.Property(u => u.CreatedAt).IsRequired();
        }
    }
}
