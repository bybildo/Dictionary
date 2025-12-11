using DicrtionaryAPI.Core.Application.Exeption;
using DicrtionaryAPI.Infrastructure.External.Google;
using DicrtionaryAPI.Infrastructure.Security;
using DicrtionaryAPI.Presentation.DTOs.Responses;
using Microsoft.EntityFrameworkCore;
using WebApi.Core.Model;
using WebApi.Infrastructure;

namespace DicrtionaryAPI.Core.Application
{
    public class UserService
    {
        private readonly AppDbContext _context;
        private readonly GoogleAuthService _googleAuthService;
        private readonly JwtService _jwtService;

        public UserService(AppDbContext context, GoogleAuthService googleAuthService, JwtService jwtService)
        {
            _context = context;
            _googleAuthService = googleAuthService;
            _jwtService = jwtService;
        }

        public async Task<string> LoginOrCreateUserAsync(string googleToken, CancellationToken ct)
        {
            var googleUser = await _googleAuthService.GetGoogleUserInfoAsync(googleToken, ct);            
            
            var userExists = await _context.Users.FirstOrDefaultAsync(u => u.Email == googleUser.Email, ct);

            if (userExists != null)
            {
                return _jwtService.GenerateToken(userExists.Id);
            }

            var user = new User(googleUser.Name, googleUser.Email);
            await _context.Users.AddAsync(user, ct);
            await _context.SaveChangesAsync(ct);

            var token = _jwtService.GenerateToken(user.Id);
            return token;
        }

        public async Task<List<UserResponse>> GetAllUsersAsync(CancellationToken ct)
        {
            return await _context.Users
                .Select(u => new UserResponse(u.Login, u.Email))
                .ToListAsync(ct);
        }

        public async Task DeleteAllUsers(CancellationToken ct)
        {
            var allUsers = _context.Users.ToList();
            _context.Users.RemoveRange(allUsers);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<bool> isUserExist(Guid? guid, CancellationToken ct)
        {
            var userExists = await _context.Users.FirstOrDefaultAsync(u => u.Id == guid, ct);
            return userExists != null ? true : false;
        }
    }
}
