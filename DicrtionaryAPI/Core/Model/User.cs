namespace WebApi.Core.Model
{
    public class User
    {
        public User()
        {
            Lessons = new List<Lesson>();
            CreatedAt = DateTime.UtcNow;
        }

        public User(string login, string email)
        {
            Login = login;
            Email = email;
            Lessons = new List<Lesson>();
            CreatedAt = DateTime.UtcNow;
        }

        public Guid Id { get; set; }
        public string Login { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<Lesson> Lessons { get; set; }
    }
}
