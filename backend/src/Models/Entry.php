<?php
namespace OptimusCrime\Challenge180Days2022\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method orderBy(string $string, string $string1)
 */
class Entry extends Model
{
    protected $table = 'entry';
    public $timestamps = false;
}