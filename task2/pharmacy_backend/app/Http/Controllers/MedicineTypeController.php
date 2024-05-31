<?php

namespace App\Http\Controllers;
use App\Models\MedicineType;
use Illuminate\Http\Request;



class MedicineTypeController extends Controller
{
    public function index()
    {
        return MedicineType::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $medicineType = MedicineType::create($request->all());

        return response()->json($medicineType, 201);
    }

    public function show(MedicineType $medicineType)
    {
        return $medicineType;
    }

    public function update(Request $request, MedicineType $medicineType)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
        ]);

        $medicineType->update($request->all());

        return response()->json($medicineType);
    }

    public function destroy(MedicineType $medicineType)
    {
        $medicineType->delete();

        return response()->json(null, 204);
    }
}
