<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['customer_id','cost'];


    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function medicines()
    {
        return $this->belongsToMany(Medicine::class)->withPivot('quantity')->withTimestamps();
    }
}
