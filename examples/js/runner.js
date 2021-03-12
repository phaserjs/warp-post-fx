DecodeURI = (value) =>
{
    return decodeURIComponent(value.replace(/\+/g, ' '));
}

GetQueryString = (parameter = '', defaultValue = '', context = location) =>
{
    let output = null;
    let result = null;
    const keyValues = context.search.substring(1).split('&');

    for (let i in keyValues)
    {
        const key = keyValues[i].split('=');

        if (key.length > 1)
        {
            if (parameter && parameter === DecodeURI(key[0]))
            {
                result = DecodeURI(key[1]);

                break;
            }
            else
            {
                if (!output)
                {
                    output = {};
                }

                output[DecodeURI(key[0])] = DecodeURI(key[1]);
            }
        }
    }

    return (result) ? result : defaultValue;
}

LoadFile = (path, callback, isJSON = false) =>
{
    const xhr = new XMLHttpRequest();

    if (isJSON)
    {
        xhr.overrideMimeType('application/json');
    }

    xhr.open('GET', path, true);

    xhr.onreadystatechange = () =>
    {
        if (xhr.readyState == 4 && xhr.status == '200')
        {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xhr.responseText);
        }
    }

    xhr.send(null);
}

LoadJSON = (path, callback) => {

    LoadFile(path, callback, true);

}

init = () => {

    const file = GetQueryString('f');

    //  Highlight the drop-down menu item
    const entry = document.getElementById('DD' + encodeURI(file));

    entry.className = entry.className + ' active';

    document.title = document.title.concat(` : ${file}`);

    LoadFile('src/' + file, result => {

        const phaserExample = document.createElement('script');

        phaserExample.type = 'module';
        phaserExample.src = 'src/' + file.split('\\').join('/');

        document.body.appendChild(phaserExample);

        document.getElementById('path').innerText = `📂 examples/src/${file}`;
        document.getElementById('src').innerText = result;

        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });

        document.getElementById('spinner').className = 'd-none';
        document.getElementById('content').className = 'd-block';

    });

}

if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll))
{
    init();
}
else
{
    document.addEventListener('DOMContentLoaded', init);
}
