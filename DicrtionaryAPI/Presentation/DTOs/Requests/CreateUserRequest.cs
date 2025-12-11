using System.ComponentModel.DataAnnotations;

namespace DicrtionaryAPI.Presentation.DTOs.Requests
{
    public class CreateUserRequest
    {
        [Required]
        public string GoogleToken { get; set; }
    }
}
