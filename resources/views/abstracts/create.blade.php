@extends('layouts.app')

@section('title', 'Submit Abstract')

@section('content')
    <div class="container-fluid">
        <div class="row mb-4">
            <div class="col">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Formatting Guideline</h5>
                        <p class="card-text">
                            Jika Anda memerlukan format khusus dalam judul abstrak atau paragraf seperti:
                            <br>
                            C<sub>2</sub>H<sub>3</sub>O<sub>2</sub><sup>-</sup>,
                            <em>Oryza sativa</em>, atau
                            <span class="mathjax">\( \vec{F}_{ij} = -\nabla V \)</span>,
                            silakan lihat panduan format di
                            <a href="#formatguide" style="text-decoration:underline">bagian bawah</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Submit Abstract</h4>
                <form class="forms-sample" action="{{ route('abstracts.store') }}" method="POST">
                    @csrf

                    <div class="form-group">
                        <label for="title" class="form-label">Title</label>
                        <input type="text" name="title" id="title"
                            class="form-control @error('title') is-invalid @enderror"
                            value="{{ old('title', $abstract->title ?? '') }}">
                        @error('title')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="symposium_id" class="form-label">Symposium</label>
                        <select class="form-select @error('symposium_id') is-invalid @enderror" id="symposium_id"
                            name="symposium_id" required>
                            <option value="">-- Select Symposium --</option>
                            @foreach ($symposiums as $symposium)
                                <option value="{{ $symposium->id }}"
                                    {{ old('symposium_id') == $symposium->id ? 'selected' : '' }}>
                                    {{ $symposium->name }}
                                </option>
                            @endforeach
                        </select>
                        @error('symposium_id')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label>Presentation Type</label>
                        <select class="form-control" name="presentation_type" required>
                            <option value="Oral presentation">Oral Presentation</option>
                            <option value="Poster presentation">Poster Presentation</option>
                        </select>
                    </div>


                    <div class="form-group">
                        <label>Publication</label>
                        <select class="form-control @error('publication') is-invalid @enderror" name="publication" required>
                            <option value="">-- Select Publication Type --</option>
                            <option value="Journal Publication"
                                {{ old('publication') == 'Journal Publication' ? 'selected' : '' }}>Journal Publication
                            </option>
                            <option value="Proceedings Indexed in EBSCO"
                                {{ old('publication') == 'Proceedings Indexed in EBSCO' ? 'selected' : '' }}>Proceedings
                                Indexed in EBSCO</option>
                        </select>
                        @error('publication')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="authors" class="form-label">Authors</label>
                        <small class="form-text text-muted mb-2">
                            Martin Karplus*[1], Werner Heisenberg[2], Ada Lovelace[2,3]
                        </small>
                        <input type="text" name="authors" id="authors"
                            class="form-control @error('authors') is-invalid @enderror"
                            value="{{ old('authors', $abstract->authors ?? '') }}">
                        @error('authors')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="affiliations">Affiliations</label>
                        <small class="form-text text-muted mb-2">
                            Example: <br>
                            [1]Dept. of Chemistry, Brawijaya University, Malang, Indonesia <br>
                            [2]Dept. of Biology, University of Tokyo, Tokyo, Japan <br>
                            [3]Dept. of Mathematics, University of Berkeley, California, USA
                        </small>
                        <textarea class="form-control" id="affiliations" name="affiliations" required cols="40" rows="10">{{ old('affiliations') }}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="corresponding_email" class="form-label">Corresponding Email</label>
                        <input type="email" name="corresponding_email" id="corresponding_email"
                            class="form-control @error('corresponding_email') is-invalid @enderror"
                            value="{{ old('corresponding_email', $abstract->corresponding_email ?? '') }}"
                            placeholder="user@example.com">
                        @error('corresponding_email')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="abstract" class="form-label">Abstract</label>
                        <small class="form-text text-muted mb-2">
                            Please see formatting guidance below, if needed
                        </small>
                        <textarea class="form-control @error('abstract') is-invalid @enderror" id="abstract" name="abstract" required
                            cols="40" rows="10" oninput="countWords()">{{ old('abstract', $abstract->abstract ?? '') }}</textarea>
                        <small id="wordCount" class="text-muted">0 words (Max: {{ $maxWords ?? 350 }} words)</small>
                        @error('abstract')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="keyword" class="form-label">Keyword</label>
                        <small class="form-text text-muted mb-2">
                            Example: <br>
                            Artificial Intelligence (AI), Machine Learning (ML), Deep Learning (DL)
                        </small>
                        <input type="text" name="keyword" id="keyword"
                            class="form-control @error('keyword') is-invalid @enderror"
                            value="{{ old('keyword', $abstract->keyword ?? '') }}">
                        @error('keyword')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <button type="submit" class="btn btn-primary">Submit</button>
                    <a href="{{ route('abstracts.index') }}" class="btn btn-light">Cancel</a>
                </form>
            </div>
        </div>
        <div class="row mt-4" id="formatguide">
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <p class="w3-container w3-center text-center"><em>The following rules in abstract formatting is
                                <strong>OPTIONAL</strong>, but they can make your abstract more readable.</em></p>
                        <h5 class="card-title text-center">ABSTRACT FORMATTING GUIDELINE</h5>
                        <div class="table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr class="table-primary text-center">
                                        <th>FORMAT</th>
                                        <th style="width:200px">CODE</th>
                                        <th style="width:400px">EXAMPLE</th>
                                        <th style="width:400px">RESULT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Italic</td>
                                        <td>&lt;em&gt; ... &lt;/em&gt;</td>
                                        <td>&lt;em&gt;Oryza sativa&lt;/em&gt;</td>
                                        <td><em>Oryza sativa</em></td>
                                    </tr>
                                    <tr>
                                        <td>Subscript</td>
                                        <td>&lt;sub&gt; ... &lt;/sub&gt;</td>
                                        <td>CH&lt;sub&gt;4&lt;/sub&gt;</td>
                                        <td>CH<sub>4</sub></td>
                                    </tr>
                                    <tr>
                                        <td>Superscript</td>
                                        <td>&lt;sup&gt; ... &lt;/sup&gt;</td>
                                        <td>H&lt;sup&gt;+&lt;/sup&gt;</td>
                                        <td>H<sup>+</sup></td>
                                    </tr>
                                    <tr>
                                        <td>Right arrow</td>
                                        <td>&amp;#8594;</td>
                                        <td>A + B &amp;#8594; C</td>
                                        <td>A + B → C</td>
                                    </tr>
                                    <tr>
                                        <td>Equilibrium arrow</td>
                                        <td>&amp;#8652;</td>
                                        <td>A + B &amp;#8652; C</td>
                                        <td>A + B ⇌ C</td>
                                    </tr>
                                    <tr>
                                        <td>LaTeX inline math</td>
                                        <td class="tex2jax_ignore">\( ... \)</td>
                                        <td class="tex2jax_ignore">
                                            The force acting between molecules is <br> given by
                                            \( \vec{F}_{ij} =-\nabla V \)
                                        </td>
                                        <td><span class="mathjax">The force acting between molecules is <br> given by
                                                \( \vec{F}_{ij} = -\nabla V \)</span></td>
                                    </tr>
                                    <tr>
                                        <td>LaTeX display math</td>
                                        <td class="tex2jax_ignore">\[ ... \]</td>
                                        <td class="tex2jax_ignore">
                                            The wave function is normalized so that <br>
                                            \[ <br>
                                            \int_0^{\infty} \psi^*_{1s} \psi_{1s} d\tau = 1 <br>
                                            \]
                                        </td>
                                        <td><span class="mathjax">The wave function is normalized so that
                                                \[ \int_0^{\infty} \psi^*_{1s} \psi_{1s} d\tau = 1
                                                \]</span></td>
                                    </tr>
                                </tbody>
                            </table>
                            <a class="btn btn-danger" href="http://www.hostmath.com/" target="_blank"
                                style="color: white; text-decoration: none;">
                                Online LaTeX equation tool
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        function countWords() {
            let text = document.getElementById("abstract").value;
            let words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
            let maxWords = {{ $maxWords ?? 350 }};
            document.getElementById("wordCount").innerText = words + " words (Max: " + maxWords + " words)";
            if (words > maxWords) {
                document.getElementById("wordCount").classList.add("text-danger");
            } else {
                document.getElementById("wordCount").classList.remove("text-danger");
            }
        }
    </script>

@endsection
