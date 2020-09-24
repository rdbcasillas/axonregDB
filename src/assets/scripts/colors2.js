export function colorPalette(){

    // if you have more than 14 arcs, choose colors from chordColors right after #6633cc
    let arcColors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", 
"#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#460e0e", "#994499", "#22aa99", "#aaaa11", "#6633cc"];


    let chordColors = ["#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac", "#04002e", "#11ff13", "#000005", "#fd82fe", "#0510fd", "#834b02", "#07d4fd", "#020e0c", "#fdbb74", "#812d83", "#04736a", "#fe2650", "#28000c", "#629509", "#8181f1", "#f1ebfe", "#98878b", "#400404", "#96cfa6", "#2c025e", "#9a0230", "#474347", "#fffc3c", "#010002", "#db6e01", "#de17ab", "#790200", "#b926ff", "#f48ea0", "#456391", "#2d2701", "#f7fdcc", "#6b07d0", "#6897ad", "#beb904", "#bbacdd", "#657249", "#03a77b", "#023754", "#b5fffe", "#48003d", "#b15a57", "#ab9353", "#c9bdb5", "#b471b3", "#2b2002", "#0d0007", "#16c94d", "#0c7119", "#73607a", "#02463b", "#c72406", "#6b342f", "#b1fb90", "#ffbee9", "#17ffc7", "#79b1fe", "#abc9d8", "#2167fe", "#4c3b6f", "#140001", "#040796", "#070008", "#010024", "#86a191", "#1eccbd", "#51451e", "#c281fe", "#805ab7", "#697679", "#282131", "#7c5c50", "#a83570", "#8783a9", "#ef13fe", "#e29a02", "#010000", "#8b7308", "#d0d483", "#78054d", "#0092e1", "#cd8367", "#89ae64", "#002203", "#da5d88", "#700200", "#ff6949", "#031601", "#4a2100", "#fecc30", "#580077", "#3d5761", "#c397b3", "#5b3252", "#b31cb8", "#933113", "#535d03", "#a26c3c", "#febab3", "#cce0d7", "#29418e", "#0a7f99", "#a8e105", "#4b0100", "#316040", "#cc1052", "#ff5bc8", "#9fa4af", "#3e2221", "#252e27", "#6d47fa", "#012e03", "#522600", "#241000", "#308356", "#09f181", "#09f4f0", "#4203a3", "#7e485d", "#9000cc", "#1a9895", "#b7fed2", "#9d6882", "#fae2d5", "#9d980b", "#fa9147", "#b64f02", "#7eb703", "#22cc8d", "#595d55", "#93d46f", "#b2b589", "#260332", "#210701", "#b6c9ff", "#945498", "#7c8c46", "#f9310d", "#06aeda", "#590024", "#5d7bbe", "#7fb5b7", "#8b7d60", "#051e2d", "#554daa", "#059b43", "#9e61f9", "#bb9c8c", "#b77a02", "#f895d1", "#d7c5da", "#95dcd3", "#e5aafc", "#320217", "#949bd6", "#c37c8b", "#d75040", "#3a4939", "#fcf187", "#000003", "#0e1c50", "#07537a", "#6f4094", "#0959bd", "#ceeafd", "#1a1313", "#510af5", "#52536b", "#5e8a7a", "#ccb159", "#f7fdfa", "#34394c", "#587a22", "#94e4fc", "#993d47", "#a9bcb3", "#3f234f", "#715d28", "#b85397", "#ee1f7b", "#5f1900", "#fd6678", "#c890d3", "#81b5d5", "#9224fb", "#e3a281", "#9c7069", "#659b6a", "#f8dda5", "#686e88", "#1cae05", "#d6e152", "#9e77c8", "#c65de1", "#670362", "#975032", "#020106", "#a20389", "#7b7074", "#d77cb1", "#293412", "#818f94", "#58da13", "#063236", "#0c75b7", "#3f3525", "#771928", "#73340a", "#4e7060", "#1db1b9", "#d08c41", "#64b69a", "#c2e3b2", "#fd8c75", "#5e473d", "#2e2f66", "#a184a4", "#0e1203", "#310700", "#391a30", "#003d1c", "#046878", "#4c82fd", "#dab0bb", "#dacdfe", "#000200", "#62555c", "#a80210", "#ba393b", "#d852c4", "#6b96ce", "#99987e", "#4ab469", "#af9bfd", "#8beda7", "#fdd8eb", "#0a0200", "#2b1409", "#5a2535", "#314144", "#6f4772", "#debf98", "#de0130", "#074955", "#591e95", "#025911", "#4e5a30", "#66588c", "#a258c5", "#8d6e9e", "#c7673e", "#5addb7", "#c5fd4b", "#180f32", "#12190a", "#cc0d7d", "#bd4a6b", "#db4f03", "#d66b6d", "#fc6da4", "#862f66", "#990556", "#188809", "#6e68cb", "#5a7e9a", "#5b1b11", "#275a52", "#487e80", "#768968", "#a4b2d4", "#abbe5c", "#0d0804", "#2616bb", "#75089f", "#a791c8", "#85cefe", "#613071", "#699d9a", "#6fcfd9", "#d9add5", "#7af061", "#000003", "#090004", "#443001", "#403141", "#714a28", "#1098b2", "#bbacbb", "#cacfd6", "#d2d4b7", "#8cf9e0", "#39476b", "#5b6169", "#ac8564", "#434906", "#93595f", "#dd76d7", "#e0fea9", "#030100", "#01261d", "#381600", "#772e47", "#3042fe", "#956106", "#6f7367", "#178c75", "#cd03e8", "#fc2ba7", "#fc18da", "#8898b5", "#6d99ff", "#bb951f", "#fd6809", "#d49290", "#aaa9a3", "#90b48d", "#c6a573", "#fea9c3", "#023272", "#53373d", "#4b6a7e", "#7a8506", "#dd4361", "#456c33", "#954e7a", "#feae37", "#28077d", "#52435a", "#807e8b", "#ff55f4", "#0e101b", "#603a03", "#63ab3e", "#e57844", "#3abfff", "#a4b1fb", "#ddfae1", "#130009", "#4a3892", "#ddb420", "#fcd474", "#441003", "#411b72", "#553422", "#82867f", "#0c0116", "#3b0057", "#332b2d", "#7e4743", "#4c5ccd", "#9537a9", "#6c6e24", "#bd239a", "#7171a8", "#8a713b", "#599040", "#21ad9c", "#12a9fe", "#a2a34d", "#79c281", "#adcb8a", "#f8d3ff", "#280f15", "#212a31", "#2f4d25", "#5f4e03", "#ac244e", "#6069fe", "#b450b4", "#b46508", "#de72fe", "#e5a45a", "#c2c4df", "#202540", "#5e1543"]

    return [arcColors,chordColors];
}
