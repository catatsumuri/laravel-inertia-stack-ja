<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\File;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\File>
 */
class FileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'name' => fake()->word . '.png',
            'visibility' => fake()->randomElement(['public', 'private']),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (File $file) {
            $numMedia = rand(1, 2); // 1つの File に対して 1~2 のメディアを追加

            for ($i = 0; $i < $numMedia; $i++) {
                // ランダムな画像サイズ
                $width = rand(300, 800);
                $height = rand(300, 800);
                $imageUrl = "https://picsum.photos/{$width}/{$height}";
                $fileName = "{$width}x{$height}_{$i}.png"; // ファイル名を指定

                // Spatie Media Library にメディアを追加
                $file->addMediaFromUrl($imageUrl)
                    ->usingFileName($fileName) // ファイル名を変更
                    ->toMediaCollection('files');
                sleep(1);
            }
        });
    }
}
