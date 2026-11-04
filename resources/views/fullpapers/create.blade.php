@extends('layouts.app')

@section('title', 'Upload Full Paper')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Upload Full Paper for Abstract: {{ $abstract->title }}</h4>
                <form action="{{ route('fullpapers.store', $abstract->id) }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="form-group">
                        <label for="file">Upload Full Paper (Doc, Docx, Pdf) Max 2 Mb</label>
                        <input type="file" class="form-control" name="file" id="file" required>
                        @error('file')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <button type="submit" class="btn btn-success">Upload</button>
                    <a href="{{ route('abstracts.index') }}" class="btn btn-danger">Cancel</a>
                </form>

            </div>
        </div>
    </div>
@endsection
