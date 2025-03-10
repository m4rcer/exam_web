<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'quantity',
        'type',
        'medicine_type_id'
    ];

    public function type()
    {
        return $this->belongsTo(MedicineType::class);
    }

    public function orders()
    {
            return $this->belongsToMany(Order::class)->withPivot('quantity')->withTimestamps();
    }
}
