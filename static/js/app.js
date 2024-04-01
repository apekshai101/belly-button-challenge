// Get the samples.json URL
const samplesURL = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";
function initialize(){
// Fetch the JSON data and process it
d3.json(samplesURL).then(function(data) {
    // Log the data to the console
    console.log(data);

    // Populate the dropdown with options
    let dropdownMenu = d3.select("#selDataset");
    for (let i = 0; i < data.names.length; i++) {
        let name = data.names[i];
        dropdownMenu.append("option").text(name).property("value", name);
    };
    
    // Call the function to initialize the dashboard 
    displayMetadata(data.names[0]);
    createBarChart(data.names[0]);
    createBubbleChart(data.names[0]);
});
}
initialize()
// Call function() when a change takes place to the DOM
    //d3.select("#selDataset").on("change", function() {
function optionChanged(selectedID){
    //let selectedID = dropdownMenu.property("value");
    displayMetadata(selectedID);
    createBarChart(selectedID);
    createBubbleChart(selectedID);
};

 // Function to update the bar chart
function createBarChart(selectedID) {
    d3.json(samplesURL).then(function(data) {
    let selectedSample = data.samples.filter(sample => sample.id === selectedID)[0];
    let topOTUs = selectedSample.otu_ids.map((index) => `OTU ${index}`).slice(0, 10).reverse();
    let topValues = selectedSample.sample_values.slice(0, 10).reverse();
    let topLabels = selectedSample.otu_labels.slice(0, 10).reverse();
    let trace = {
        x: topValues,
        y: topOTUs,
        text: topLabels,
        type: 'bar',
        orientation: 'h'
    };

    let layout = {
        title: 'Top 10 OTUs',
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU ID' }
    };

    let chartData = [trace];

    Plotly.newPlot('bar', chartData, layout);
})
} 



// Function to create the bubble chart
function createBubbleChart(selectedID) {
    d3.json(samplesURL).then(function(data) {
    let selectedSample = data.samples.filter(sample => sample.id === selectedID)[0];
    console.log(selectedSample)
    let trace2 = {
        x: selectedSample.otu_ids,
        y: selectedSample.sample_values,
        text: selectedSample.otu_labels,
        mode: 'markers',
        marker: {
            size: selectedSample.sample_values,
            color: selectedSample.otu_ids
        }
    };

    let layout = {
        title: "OTU Bubble Chart",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Value" }
    };

    Plotly.newPlot("bubble", [trace2], layout);
})
}


// Function to display sample metadata
function displayMetadata(selectedID) {
    d3.json(samplesURL).then(function(data) {
    let metadata = data.metadata.filter(metadata => metadata.id.toString() === selectedID)[0];

    // Get the sample metadata div
    let sampleMetadataDiv = d3.select("#sample-metadata");
    sampleMetadataDiv.html("")
    Object.entries(metadata).forEach(entry => {
        const [key, value] = entry;
        console.log(key, value);
        sampleMetadataDiv.append("h6").text(`${key}: ${value}`);   
      });
    })  
}

