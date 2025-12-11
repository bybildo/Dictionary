using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApi.Core.Model;

namespace WebApi.Infrastructure.Configurations
{
    public class WordConfiguration : IEntityTypeConfiguration<Word>
    {
        public void Configure(EntityTypeBuilder<Word> builder)
        {
            builder.HasIndex(w => new { w.LessonId, w.OrderInLesson }).IsUnique();
            builder.HasOne(w => w.Lesson)
                .WithMany(l => l.Words);
            builder.Property(w => w.InitialWord).IsRequired();
            builder.Property(w => w.Translate).IsRequired();
            builder.Property(w => w.OrderInLesson).IsRequired();
        }
    }
}
