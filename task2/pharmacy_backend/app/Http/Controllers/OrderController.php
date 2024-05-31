<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return Order::with('medicines', 'customer')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'medicines' => 'required|array',
            'medicines.*.id' => 'required|exists:medicines,id',
            'medicines.*.quantity' => 'required|integer|min:1',
        ]);

        $order = Order::create([
            'customer_id' => $request->customer_id,
        ]);

        foreach ($request->medicines as $medicine) {
            $order->medicines()->attach($medicine['id'], ['quantity' => $medicine['quantity']]);
        }

        return response()->json($order->load('medicines', 'customer'), 201);
    }

    public function show(Order $order)
    {
        return $order->load('medicines', 'customer');
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'customer_id' => 'sometimes|required|exists:customers,id',
            'medicines' => 'sometimes|required|array',
            'medicines.*.id' => 'sometimes|required|exists:medicines,id',
            'medicines.*.quantity' => 'sometimes|required|integer|min:1',
        ]);

        if ($request->has('customer_id')) {
            $order->update(['customer_id' => $request->customer_id]);
        }

        if ($request->has('medicines')) {
            $order->medicines()->detach();
            foreach ($request->medicines as $medicine) {
                $order->medicines()->attach($medicine['id'], ['quantity' => $medicine['quantity']]);
            }
        }

        return response()->json($order->load('medicines', 'customer'));
    }

    public function destroy(Order $order)
    {
        $order->medicines()->detach();
        $order->delete();

        return response()->json(null, 204);
    }
}
