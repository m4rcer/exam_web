<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    public function index()
    {
        return Medicine::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'medicine_type_id' => 'required|exists:medicine_types,id',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
        ]);

        $medicine = Medicine::create($request->all());

        return response()->json($medicine, 201);
    }

    public function show(Medicine $medicine)
    {
        return $medicine;
    }

    public function update(Request $request, Medicine $medicine)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'medicine_type_id' => 'sometimes|required|exists:medicine_types,id',
            'price' => 'sometimes|required|numeric',
            'quantity' => 'sometimes|required|integer',
        ]);

        $medicine->update($request->all());

        return response()->json($medicine);
    }

    public function destroy(Medicine $medicine)
    {
        $medicine->delete();

        return response()->json(null, 204);
    }
}
