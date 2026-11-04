@extends('layouts.app')
@section('title', 'Edit Venue')
@section('content')
    <div class="col-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title mb-4">Edit Venue</h4>
                <form action="{{ route('landing.venue.update', $venue->id) }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')
                    
                    <div class="form-group mb-3">
                        <label for="venue_name">Venue Name</label>
                        <input type="text" class="form-control" name="venue_name" id="venue_name" required minlength="3"
                            value="{{ old('venue_name', $venue->venue_name) }}" 
                            placeholder="Masukkan nama venue (minimal 3 karakter)">
                        @error('venue_name')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form-group mb-3">
                        <label for="address">Address</label>
                        <input type="text" class="form-control" name="address" id="address" required minlength="5"
                            value="{{ old('address', $venue->address) }}" 
                            placeholder="Masukkan alamat lengkap (contoh: Jl. Merdeka No. 10, Jakarta)">
                        @error('address')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form-group mb-3">
                        <label for="date">Date</label>
                        <input type="date" class="form-control" name="date" id="date" required
                            value="{{ old('date', $venue->date) }}">
                        @error('date')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form-group mb-3">
                        <label for="link_map">Link Map</label>
                        <input type="url" class="form-control" name="link_map" id="link_map" required
                            value="{{ old('link_map', $venue->link_map) }}"
                            placeholder="Tempel link lokasi dari Google Maps di sini">
                        @error('link_map')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form-group mb-3">
                        <label for="map">Frame Map</label>
                        <input type="text" class="form-control" name="map" id="map" required
                            value="{{ old('map', $venue->map) }}" 
                            placeholder="Masukkan iframe Google Maps">
                        @error('map')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form-group mb-3">
                        <label class="form-label">Current Image</label>
                        <div>
                            <img src="{{ asset('storage/' . $venue->image_path) }}" id="currentImage" 
                                 alt="Current Venue Image" style="max-width: 300px; border:1px solid #ddd; padding:5px;">
                        </div>
                    </div>

                    <div class="form-group mb-3">
                        <label for="image_path">Change Image</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" name="image_path" id="image_path" 
                                       accept=".png, .jpg, .jpeg">
                                <label class="custom-file-label" for="image_path" id="fileLabel">Choose file</label>
                            </div>
                        </div>
                        @error('image_path')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form-group mb-3">
                        <label for="year">Year</label>
                        <input type="number" class="form-control" name="year" id="year" required
                            value="{{ old('year', $venue->year) }}" min="2024" max="{{ date('Y') }}"
                            placeholder="Masukkan tahun (min: 2024, max: {{ date('Y') }})">
                        @error('year')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    

                    <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-success" id="submitBtn">Save</button>
                    <a href="{{ route('landing.venue.index') }}" class="btn btn-danger">Cancel</a>
                </div>
                </form>
            </div>
        </div>
    </div>
@endsection
