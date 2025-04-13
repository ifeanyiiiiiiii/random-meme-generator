document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-button') as HTMLButtonElement | null;
    const memeImage = document.getElementById('meme-image') as HTMLImageElement | null;
    const topTextInput = document.getElementById('top-text-input') as HTMLInputElement | null;
    const bottomTextInput = document.getElementById('bottom-text-input') as HTMLInputElement | null;
    const topTextElement = document.getElementById('top-text') as HTMLDivElement | null;
    const bottomTextElement = document.getElementById('bottom-text') as HTMLDivElement | null;
    const memeCaption = document.getElementById('meme-caption') as HTMLDivElement | null;
    const deleteCaptionButton = document.getElementById('delete-caption-button') as HTMLButtonElement | null;
    const favoriteButton = document.getElementById('favorite-button') as HTMLButtonElement | null;
    const displayFavoritesButton = document.getElementById('display-favorites-button') as HTMLButtonElement | null;
    console.log(displayFavoritesButton);
    const favoritesContainer = document.getElementById('favorites-container') as HTMLDivElement | null;
    console.log('displayFavoritesButton element:', displayFavoritesButton);
    console.log('favoritesContainer on DOMContentLoaded:', favoritesContainer); // ADDED LOG
    const fontSelector = document.getElementById('font-selector') as HTMLSelectElement | null;
    const colorPicker = document.getElementById('color-picker') as HTMLInputElement | null;
    const fontSizeInput = document.getElementById('font-size-input') as HTMLInputElement | null;


    // Function definitions

    function fetchRandomMeme() {
        console.log('fetchRandomMeme started.');
        fetch('https://meme-api.com/gimme')
            .then(response => {
                console.log('fetch response:', response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('fetch data:', data);
                if (memeImage && data.url) {
                    memeImage.src = data.url;
                    console.log('Meme image src set:', data.url);
                } else {
                    console.error('Error: Meme image element not found or URL missing in API response.');
                }
            })
            .catch(error => {
                console.error('There was a problem fetching the meme:', error);
            });
        console.log('fetchRandomMeme finished.');
    }

    function saveFavoriteMeme(memeUrl: string) {
        const favorites = localStorage.getItem('favoriteMemes');
        let favoriteArray: string[] = favorites ? JSON.parse(favorites) : [];

        if (!favoriteArray.includes(memeUrl)) {
            favoriteArray.push(memeUrl);
            localStorage.setItem('favoriteMemes', JSON.stringify(favoriteArray));
            console.log(`${memeUrl} added to favorites.`);
        } else {
            console.log(`${memeUrl} is already in favorites.`);
        }
    }

    function displayFavoriteMemes() {
        console.log('View Favorites button clicked! (Function start)');
        const favoritesContainer = document.getElementById('favorites-container') as HTMLDivElement | null;
    
        if (favoritesContainer) {
            favoritesContainer.style.display = 'block';
            favoritesContainer.innerHTML = '<h2>My Favorite Memes</h2>';
    
            const favorites = localStorage.getItem('favoriteMemes');
            const favoriteArray: string[] = favorites ? JSON.parse(favorites) : [];
    
            console.log('Favorite array from storage (early):', favoriteArray);
            console.log('Length of favoriteArray (early):', favoriteArray.length);
    
            if (favoriteArray.length > 0) {
                favoriteArray.forEach(memeUrl => {
                    console.log('Processing URL:', memeUrl);
    
                    const memeDiv = document.createElement('div'); // Create a container for the image and button
                    memeDiv.classList.add('favorite-meme-item');
    
                    const img = document.createElement('img');
                    img.src = memeUrl;
                    img.classList.add('favorite-meme-image');
                    memeDiv.appendChild(img);
    
                    const removeButton = document.createElement('button');
                    removeButton.textContent = 'Remove';
                    removeButton.classList.add('remove-favorite-button');
                    removeButton.addEventListener('click', () => {
                        removeFavoriteMeme(memeUrl);
                    });
                    memeDiv.appendChild(removeButton);
    
                    favoritesContainer.appendChild(memeDiv);
                    console.log('Image element appended:', img);
                    console.log('Remove button appended:', removeButton);
                });
            } else {
                const message = document.createElement('p');
                message.textContent = 'No favorite memes saved yet.';
                favoritesContainer.appendChild(message);
                console.log('No favorites message appended.');
            }
        } else {
            console.error('favoritesContainer element not found.');
        }
        console.log('displayFavoriteMemes function finished.');
    }
    
    function removeFavoriteMeme(urlToRemove: string) {
        const favorites = localStorage.getItem('favoriteMemes');
        let favoriteArray: string[] = favorites ? JSON.parse(favorites) : [];
    
        const updatedFavorites = favoriteArray.filter(url => url !== urlToRemove);
        localStorage.setItem('favoriteMemes', JSON.stringify(updatedFavorites));
        console.log(`${urlToRemove} removed from favorites.`);
    
        // Re-render the favorite memes list
        displayFavoriteMemes();
    }

    // Event listeners
    if (generateButton) {
        generateButton.addEventListener("click", fetchRandomMeme);
    }

    if (displayFavoritesButton) {
        displayFavoritesButton.onclick = () => {
            console.log('Button was clicked!');
            alert('Button was clicked!');
            displayFavoriteMemes();
        };
    }

    if (topTextInput && memeCaption) {
        topTextInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const currentCaption = memeCaption.textContent ? memeCaption.textContent.trim() : '';
                const newTopCaptionPart = topTextInput.value.trim();

                memeCaption.textContent = currentCaption ? `${currentCaption} ${newTopCaptionPart}`.trim() : newTopCaptionPart;
                topTextInput.value = '';
            }
        });
    }

    if (bottomTextInput && memeCaption) {
        bottomTextInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const currentCaption = memeCaption.textContent ? memeCaption.textContent.trim() : '';
                const newBottomCaptionPart = bottomTextInput.value.trim();

                memeCaption.textContent = currentCaption ? `${currentCaption} ${newBottomCaptionPart}`.trim() : newBottomCaptionPart;
                bottomTextInput.value = '';
            }
        });
    }

    if (deleteCaptionButton && memeCaption) {
        deleteCaptionButton.addEventListener('click', () => {
            memeCaption.textContent = '';
        });
    }

    if (favoriteButton && memeImage) {
        favoriteButton.addEventListener('click', () => {
            const currentMemeUrl = memeImage.src;
            if (currentMemeUrl && currentMemeUrl !== '#') {
                saveFavoriteMeme(currentMemeUrl);
                favoriteButton.textContent = 'Added!';
                setTimeout(() => {
                    favoriteButton.textContent = 'Add to Favorites';
                }, 1500);
            } else {
                console.warn('No meme to add to favorites.');
            }
        });
    }
    if (fontSelector && memeCaption) {
        fontSelector.addEventListener('change', () => {
            const selectedFont = fontSelector.value;
            memeCaption.style.fontFamily = selectedFont;
        });
    }
    
    if (colorPicker && memeCaption) {
        colorPicker.addEventListener('input', () => {
            const selectedColor = colorPicker.value;
            memeCaption.style.color = selectedColor;
        });
    }
    
    if (fontSizeInput && memeCaption) {
        fontSizeInput.addEventListener('input', () => {
            const selectedSize = fontSizeInput.value + 'px';
            memeCaption.style.fontSize = selectedSize;
        });
    }

    // Initial fetch
    fetchRandomMeme();
});