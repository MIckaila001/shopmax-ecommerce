using Microsoft.AspNetCore.SignalR;

namespace ShopMax.Hubs;

/// <summary>
/// Hub SignalR pour le suivi des commandes en temps reel.
/// Note : necessite le package Microsoft.AspNetCore.SignalR (inclus dans ASP.NET Core).
/// </summary>
public class OrderHub : Hub
{
    public async Task JoinOrderGroup(string orderNumber)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"order-{orderNumber}");
    }

    public async Task LeaveOrderGroup(string orderNumber)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"order-{orderNumber}");
    }
}
