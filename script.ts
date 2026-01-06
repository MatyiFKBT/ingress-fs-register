
const formData = [
  { id: 1775527946, name: "City", value: "Budapest" },
  { id: 1102707395, name: "Country", value: "Hungary" },
  { id: 2109327838, name: "Event Page or Telegram Channel", value: "" },
  { id: 1809010630, name: "Event Description", value: "<h1>Ingress FS Event in Budapest</h1><p>yay lets go</p>" },
  { id: 329793926, name: "Enlightened Leader email address", value: "dnsdns@gmail.com" },
  { id: 939910283, name: "Enlightened Leader Agent Name", value: "qns" },
  {
    id: 671403473,
    name: "Enlightened Leader Social Media Profile Link",
    value: "https://t.me/qnsdns",
  },
  { id: 1803675650, name: "Resistance Leader email address", value: "mmatyi1999@gmail.com" },
  { id: 1535781286, name: "Resistance Leader Agent Name", value: "M4tyi" },
  {
    id: 314166447,
    name: "Resistance Leader Social Media Profile Link",
    value: "https://t.me/m4tyi",
  },
  { id: 1140650120, name: "Auto Score Sheet URL", value: "" },
  { id: 1677540642, name: "Preferred Language", other: "Hungarian" },
  { id: 222644845, name: "Hide Attendee List", value: "Show List" },
  {
    "id": 1534513796,
    "name": "Event Start Time",
    value: "14:00"
  },
  {
    "id": 1756031242,
    "name": "Base Portal Name",
    value: "Base portal"
  },
  {
    "id": 1702289666,
    "name": "Base Portal URL",
    value: "https://intel.ingress.com"
  },
  {
    "id": 1570769333,
    "name": "Event Type", value: "Onsite"
  },
  {
    "id": 2839749,
    "name": "Restocking Portal Name",
    value: "Blue House"
  },
  {
    "id": 158918171,
    "name": "Restocking Portal Intel URL",
    value: "https://intel.ingress.com/intel?pll=47.491268,19.06873"
  },
  {
    "id": 221911722,
    "name": "Onsite Puzzle Path",
    value: "From the start portal to the restock portal"
  }
];

const baseUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSc0n27dpw5ewId4ugkesc8QpjF1on29ThxcU776kA53ayrkvQ/viewform";

const params = formData
  .filter((field) => field.value || field.other)
  // .map((field) => `entry.${field.id}=${encodeURIComponent(field.value)}`)
  .map((field) => {
    const parts = [];
    if (field.value) {
      parts.push(`entry.${field.id}=${encodeURIComponent(field.value)}`);
    }
    if (field.other) {
      parts.push(
        `entry.${field.id}=__other_option__&entry.${field.id}.other_option_response=${encodeURIComponent(field.other)}`
      );
    }
    return parts.join("&");
  })
  .join("&");

const fullUrl = params ? `${baseUrl}?${params}` : baseUrl;
console.log(fullUrl);
