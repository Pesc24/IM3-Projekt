 //Search Suggestions
        document.getElementById('city-search').addEventListener('input', function () {
            const query = this.value.toLowerCase().substring(0, 3); // Get the first 3 letters of the input
            const suggestions = europeanCapitals.filter(capital => 
                capital.name.toLowerCase().startsWith(query)
            ).slice(0, 4); // Limit suggestions to 4

            // Clear previous suggestions
            let suggestionBox = document.getElementById('suggestions');
            suggestionBox.innerHTML = '';

            // Add new suggestions
            suggestions.forEach(suggestion => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item';
                suggestionItem.innerText = suggestion.name;
                
                // When the suggestion is clicked, populate the input and fetch data
                suggestionItem.addEventListener('click', () => {
                    document.getElementById('city-search').value = suggestion.name;
                    suggestionBox.innerHTML = ''; // Clear suggestions
                    suggestionBox.style.display = 'none'; // Hide suggestion box
                    document.getElementById('map').style.marginTop = '10vh'; // Reset margin-top of map
                    fetchData(suggestion.name); // Fetch data for the selected city
                });

                suggestionBox.appendChild(suggestionItem);
            });

            // Position the suggestion box below the input field
            const inputRect = this.getBoundingClientRect();
            suggestionBox.style.position = 'absolute';
            suggestionBox.style.left = '50%';
            suggestionBox.style.transform = 'translateX(-50%)';
            suggestionBox.style.width = `calc(${inputRect.width}px - 40px)`;
            suggestionBox.style.top = `${inputRect.bottom}px`; /* Align box directly below */
            suggestionBox.style.display = suggestions.length ? 'block' : 'none'; // Show or hide suggestion box based on suggestions

            // Adjust margin-top of map if suggestions are visible
            document.getElementById('map').style.marginTop = suggestions.length ? '25vh' : '10vh';
        });

        // Show suggestions when clicking on the search box if there's input
        document.getElementById('city-search').addEventListener('focus', function () {
            const query = this.value.toLowerCase().substring(0, 1); // Get the first letter of the input
            if (query) {
                const suggestions = europeanCapitals.filter(capital => 
                    capital.name.toLowerCase().startsWith(query)
                ).slice(0, 4); // Limit suggestions to 4

                let suggestionBox = document.getElementById('suggestions');
                suggestionBox.innerHTML = '';

                // Add new suggestions
                suggestions.forEach(suggestion => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'suggestion-item';
                    suggestionItem.innerText = suggestion.name;
                    
                    // When the suggestion is clicked, populate the input and fetch data
                    suggestionItem.addEventListener('click', () => {
                        document.getElementById('city-search').value = suggestion.name;
                        suggestionBox.innerHTML = ''; // Clear suggestions
                        suggestionBox.style.display = 'none'; // Hide suggestion box
                        document.getElementById('map').style.marginTop = '10vh'; // Reset margin-top of map
                        fetchData(suggestion.name); // Fetch data for the selected city
                    });

                    suggestionBox.appendChild(suggestionItem);
                });
                // Position the suggestion box below the input field
                const inputRect = this.getBoundingClientRect();
                suggestionBox.style.position = 'absolute';
                suggestionBox.style.left = '50%';
                suggestionBox.style.transform = 'translateX(-50%)';
                suggestionBox.style.width = `calc(${inputRect.width}px - 40px)`;
                suggestionBox.style.top = `${inputRect.bottom}px`; /* Align box directly below */
                suggestionBox.style.display = suggestions.length ? 'block' : 'none'; // Show or hide suggestion box based on suggestions

                // Adjust margin-top of map if suggestions are visible
                document.getElementById('map').style.marginTop = suggestionBox.style.display === 'block' ? '25vh' : '10vh';
            }
        });

        // Hide suggestions when clicking outside the search box
        document.addEventListener('click', function (event) {
            const searchBox = document.getElementById('city-search');
            const suggestionBox = document.getElementById('suggestions');
            if (suggestionBox && !searchBox.contains(event.target) && !suggestionBox.contains(event.target)) {
                suggestionBox.innerHTML = ''; // Clear suggestions
                suggestionBox.style.display = 'none'; // Hide suggestion box
                document.getElementById('map').style.marginTop = '10vh'; // Reset margin-top of map
            }
        });

        // Hide suggestions when pressing Enter
        document.getElementById('city-search').addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                const suggestionBox = document.getElementById('suggestions');
                if (suggestionBox) {
                    suggestionBox.innerHTML = ''; // Clear suggestions
                    suggestionBox.style.display = 'none'; // Hide suggestion box
                    document.getElementById('map').style.marginTop = '10vh'; // Reset margin-top of map
                }
            }
        });