<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Spatie\MediaLibrary\Support\MediaStream;

class FileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $files = File::latest()->with(['media', 'user'])->orderBy('id', 'desc')->get()->map(function ($file) {
            $firstMedia = $file->media->first();

            return [
                'id' => $file->id,
                'name' => $file->name,
                'owner' => $file->user->name,
                'visibility' => $file->visibility,
                'created_at' => $file->created_at,
                'filesize' => $firstMedia?->human_readable_size ?? null,
                'mediaId' => $firstMedia->id,
                'mediaCount' => $file->media->count(),
                'original_filename' => $firstMedia?->file_name ?? null,
            ];
        });
        return Inertia::render('Files/Index', [
            'files' => $files,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        DB::beginTransaction();

        try {
            $file = auth()->user()->files()->create([
                'name' => $request->filename,
                'visibility' => $request->visibility,
            ]);
            $file->addMedia($request->file('files'))->toMediaCollection('files');
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            die($e->getMessage());
        }
        return redirect()->route('files.index')->with('success', 'File uploaded successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, File $file): StreamedResponse
    {
        $media = $file->getFirstMedia('files');
        return $media->toInlineResponse($request);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(File $file)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, File $file)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(File $file)
    {
        //
    }


    public function conversion(Request $request, File $file, Media $media, string $conversion)
    {
        // ファイルに関連付けられているメディアかどうか確認
        if ($media->model_id !== $file->id || $media->model_type !== File::class) {
            abort(404);
        }
        if (! $conversionPath = $media->getPath($conversion)) {
            abort(404);
        }
        return response()->file($conversionPath, [
            'Content-Type' => mime_content_type($conversionPath),
            'Content-Disposition' => 'inline',
        ]);
    }

    public function zip(File $file): MediaStream
    {
        $mediaItems = $file->getMedia('files');

        if ($mediaItems->isEmpty()) {
            return back()->with('error', 'No files available for download.');
        }

        return MediaStream::create("file_{$file->id}.zip")->addMedia($mediaItems);
    }

}
