export interface AboutImage {
    url: string;
    alt: string;
    caption?: string;
    type: "profile" | "workspace" | "lifestyle" | "achievement";
    assetId: string;
    timestamp?: string;
    verified?: boolean;
}

export const aboutImages: AboutImage[] = [
    {
        url: "https://picsum.photos/seed/workspace1/800/600",
        alt: "Engineering Workspace",
        caption: "Primary development environment",
        type: "workspace",
        assetId: "ASSET-001",
        timestamp: "2024-11-15T09:30:00Z",
        verified: true
    },
    {
        url: "https://picsum.photos/seed/lifestyle1/800/600",
        alt: "Team Collaboration",
        caption: "Cross-functional strategy session",
        type: "lifestyle",
        assetId: "ASSET-002",
        timestamp: "2024-10-20T14:45:00Z",
        verified: true
    },
    {
        url: "https://picsum.photos/seed/achievement1/800/600",
        alt: "Project Launch",
        caption: "System deployment milestone",
        type: "achievement",
        assetId: "ASSET-003",
        timestamp: "2024-09-01T16:00:00Z",
        verified: true
    },
    {
        url: "https://picsum.photos/seed/workspace2/800/600",
        alt: "Architecture Planning",
        caption: "System design review",
        type: "workspace",
        assetId: "ASSET-004",
        timestamp: "2024-08-10T11:20:00Z",
        verified: true
    },
    {
        url: "https://picsum.photos/seed/lifestyle2/800/600",
        alt: "Global Operations",
        caption: "Remote collaboration across timezones",
        type: "lifestyle",
        assetId: "ASSET-005",
        timestamp: "2024-07-25T08:15:00Z",
        verified: true
    }
];

// Hero profile image
export const heroImage: AboutImage = {
    url: "https://picsum.photos/seed/profile-hero/600/800",
    alt: "Profile Verification Image",
    caption: "Identity verified",
    type: "profile",
    assetId: "KYC-PROFILE-001",
    timestamp: new Date().toISOString(),
    verified: true
};
