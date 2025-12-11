namespace DicrtionaryAPI.Core.Application.Exeption
{
    public class UserInformationAlreadyExistException : Exception
    {
        public UserInformationAlreadyExistException(string message) : base(message) { }
    }
}
