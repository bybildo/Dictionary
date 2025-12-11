namespace WebApi.Core.Model
{
    public class Word
    {
        public Word()
        {
        }

        public Word(string initialWord, string translate, int orderInLesson, Guid lessonId)
        {
            InitialWord = initialWord;
            Translate = translate;
            OrderInLesson = orderInLesson;
            LessonId = lessonId;
        }

        public Guid Id { get; set; }
        public Guid LessonId { get; set; }
        public Lesson Lesson { get; set; }
        public int OrderInLesson { get; set; }
        public string InitialWord { get; set; }
        public string Translate { get; set; }
    }
}
