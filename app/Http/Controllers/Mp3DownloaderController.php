<?php

namespace App\Http\Controllers;

use App\Models\DownloadHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Str;

class Mp3DownloaderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $downloadHistory = DownloadHistory::latest()->get();
       return inertia('Mp3Downloader/Index', ['downloadHistory' => $downloadHistory]);
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
    public function store(Request $request)
    {
        set_time_limit(300);
        $request->validate([
            'url'=> 'required|url' 
        ]);

        $url = $request->url;

        $isWindows = PHP_OS_FAMILY === 'Windows';        

        $ytDlpBinary = $isWindows ? 'yt-dlp.exe' : 'yt-dlp_linux';
        $ytDlpPath = storage_path('app/bin/' . $ytDlpBinary);

        $ffmpegPath = storage_path('app/bin');
        $systemPath = getenv('PATH');
        if (!$isWindows) {
            $systemPath .= ':/usr/bin:/usr/local/bin';
        }

        $tempDir = storage_path('app/temp');
        if(!file_exists($tempDir)){
            mkdir($tempDir, 0777, true);
        }

        $env = [
                'TEMP' => $tempDir,
                'TMP'  => $tempDir,
                'SystemRoot'  => 'C:\Windows',
                'SystemDrive' => 'C:',
                // 'PATH' => getenv('PATH'),
                'PATH'        => $systemPath,
        ];

        try{

            $fileName = Str::random(10) . '.mp3';
            $outputPath = storage_path('app/public/downloads/' . $fileName); 

            // $getUrlTitle = Process::timeout(30)->env($env)->run([$ytDlpPath, '--print', 'title', '--no-playlist', $url]);
            // $getUrlThumbnail = Process::timeout(30)->env($env)->run([$ytDlpPath, '--print', 'thumbnail','--no-playlist', $url]);

            // $thumbnailUrl = null;
            // if ($getUrlThumbnail->successful()) {
            //     $thumbnailUrl = trim($getUrlThumbnail->output());
            // }


            // if($getUrlTitle->successful()) {
            //     $rawTitle = trim($getUrlTitle->output());
            //     $fileName = Str::slug($rawTitle) . '.mp3';
            // } else {
            //     $fileName = Str::random(10) . '.mp3'; 
            // }


            if(!file_exists(storage_path('app/public/downloads'))){
                mkdir(storage_path('app/public/downloads'), 0777, true);
            }

            $result = Process::timeout(300)->env($env)->run([
                $ytDlpPath,
                '--js-runtimes', 'node',
                '--ffmpeg-location', $ffmpegPath,
                '--extractor-args', 'youtube:player_client=web,default',
                '--rm-cache-dir',
                '--dump-json',
                '--no-simulate',
                '--no-progress',
                '--force-ipv4',
                '-f', 'ba',
                '-x',
                '--audio-format', 'mp3',
                '-o', $outputPath,
                '--no-playlist',
                $url
            ]);

            if($result->successful()) {
                $videoData = json_decode($result->output(), true);
                $rawTitle = $videoData['title'] ?? 'Unknown Title'; 
                $rawThumbnail = $videoData['thumbnail'] ?? null;


                DownloadHistory::create([
                    'download_url'=> $url,
                    'download_title' => $rawTitle,
                    'download_thumbnail'=>$rawThumbnail,
                ]);


                return back()->with([
                    'type'         => 'positive',
                    'message'      => "Berhasil mengonversi: {$rawTitle}",
                    'download_url' => route('mp3-downloader.download', ['filename' => $fileName, 'title' => $rawTitle]),
                    'download_title'        => $rawTitle,
                    'download_thumbnail'    => $rawThumbnail
                ]);
            } else {
                $errorMsg = $result->errorOutput();
                if(empty(trim($errorMsg))) {
                    $errorMsg = $result->output();
                }
                return back()->with([
                    'type'    => 'negative',
                    'message' => 'Gagal mengonversi: ' . $errorMsg
                ]);
            }
        } catch (\Illuminate\Process\Exceptions\ProcessTimedOutException $e){
            return back()->with([
                    'type'    => 'negative',
                    'message' => 'Connection Timeout: ' . $e->getMessage()
                ]);
        } catch (\Exception $e){
            return back()->with([
                    'type'    => 'negative',
                    'message' => 'Error: ' . $e->getMessage()
                ]);
        }
    }

    public function downloadFile(Request $request, $fileName){
        $filePath = storage_path('app/public/downloads/') . basename($fileName);
        if (!file_exists($filePath)) {
            abort(404, 'MP3 not found');
        }

        $title = $request->query('title', 'Audio_Download');
        $safeTitle = preg_replace('/[\/\\:\*\?"<>\|]/', '', $title);
        return response()->download($filePath, $safeTitle . '.mp3');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
