using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopMax.Data;
using ShopMax.Models;

namespace ShopMax.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        var categories = await _context.Categories
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.Slug,
                c.ImageUrl,
                ProductCount = _context.Products.Count(p => p.CategoryId == c.Id && p.IsActive)
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetCategory(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound();
        return Ok(category);
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<Category>> GetCategoryBySlug(string slug)
    {
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Slug == slug);
        if (category == null) return NotFound();
        return Ok(category);
    }
}
