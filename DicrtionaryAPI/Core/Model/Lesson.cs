namespace WebApi.Core.Model
{
    public class Lesson
    {
        public Lesson()
        {
            Words = new List<Word>();
            CreatedAt = DateTime.UtcNow;
        }

        public Lesson(string name, Guid userId)
        {
            Name = name;
            UserId = userId;
            Words = new List<Word>();
            CreatedAt = DateTime.UtcNow;
        }

        public Guid Id { get; set; }
        public User User { get; set; }
        public Guid UserId { get; set; }
        public string Name { get; set; }
        public ICollection<Word> Words { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
