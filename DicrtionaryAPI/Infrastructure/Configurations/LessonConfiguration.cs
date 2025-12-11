using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApi.Core.Model;

namespace WebApi.Infrastructure.Configurations
{
    public class LessonConfiguration : IEntityTypeConfiguration<Lesson>
    {
        public void Configure(EntityTypeBuilder<Lesson> builder)
        {
            builder.HasKey(l => l.Id);
            builder.HasMany(l => l.Words)
                .WithOne(w => w.Lesson)
                .HasForeignKey(w => w.LessonId);
            builder.Property(l => l.Name).IsRequired();
            builder.Property(l => l.CreatedAt).IsRequired();
        }
    }
}
