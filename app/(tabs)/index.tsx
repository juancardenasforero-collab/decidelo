import { FlatList, Dimensions, ViewToken } from "react-native";
import VideoCard from "@/components/VideoCard";
import { videos } from "@/data/mockVideos";
import { useRef, useState } from "react";

const { height } = Dimensions.get("window");

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index || 0);
      }
    }
  );

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <VideoCard item={item} isActive={index === activeIndex} />
      )}
      pagingEnabled
      snapToInterval={height}
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
    />
  );
}