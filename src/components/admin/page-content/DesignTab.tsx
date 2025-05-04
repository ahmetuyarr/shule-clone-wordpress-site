
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Image, Layout, FileText, Eye, Type, Link as LinkIcon, 
  FormInput, PanelLeft, MoveHorizontal, Square, CircleUser
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";

// Component types
interface DesignTabProps {
  pageKey?: string;
  content?: Record<string, any>;
  onContentChange?: (sectionKey: string, value: any) => void;
}

// Element type definition
interface DesignElement {
  id: string;
  type: string;
  content: any;
  icon: React.ReactNode;
  label: string;
}

const DesignTab: React.FC<DesignTabProps> = ({ 
  pageKey, 
  content = {}, 
  onContentChange 
}) => {
  const [elements, setElements] = useState<DesignElement[]>(
    content?.design_elements || []
  );

  // Available elements for the sidebar
  const availableElements: DesignElement[] = [
    { 
      id: "banner", 
      type: "banner", 
      content: { title: "Banner Başlığı", subtitle: "Alt başlık", buttonText: "Daha Fazla", buttonLink: "/" },
      icon: <Layout size={20} />,
      label: "Banner"
    },
    { 
      id: "image", 
      type: "image", 
      content: { src: "/placeholder.svg", alt: "Resim", width: "100%", height: "auto" },
      icon: <Image size={20} />,
      label: "Resim"
    },
    { 
      id: "text", 
      type: "text", 
      content: { text: "Metin içeriği buraya gelecek." },
      icon: <Type size={20} />,
      label: "Metin"
    },
    { 
      id: "button", 
      type: "button", 
      content: { text: "Buton", link: "/", variant: "default" },
      icon: <CircleUser size={20} />,
      label: "Buton"
    },
    { 
      id: "link", 
      type: "link", 
      content: { text: "Bağlantı", url: "/" },
      icon: <LinkIcon size={20} />,
      label: "Bağlantı"
    },
    { 
      id: "form", 
      type: "form", 
      content: { title: "Form Başlığı", fields: [] },
      icon: <FormInput size={20} />,
      label: "Form"
    },
    { 
      id: "survey", 
      type: "survey", 
      content: { question: "Anket Sorusu?", options: ["Seçenek 1", "Seçenek 2"] },
      icon: <FileText size={20} />,
      label: "Anket"
    },
    { 
      id: "container", 
      type: "container", 
      content: { elements: [] },
      icon: <Square size={20} />,
      label: "Konteyner"
    }
  ];

  // Handle drag end
  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // If the source is from available elements and destination is page canvas
    if (source.droppableId === "available-elements" && destination.droppableId === "page-canvas") {
      const element = availableElements[source.index];
      const newElement = {
        ...element,
        id: `${element.type}-${Date.now()}`, // Create unique ID
      };
      
      const newElements = [...elements, newElement];
      setElements(newElements);
      
      // Update content via callback
      if (onContentChange) {
        onContentChange("design_elements", newElements);
      }
    }
    // Reordering within page canvas
    else if (source.droppableId === "page-canvas" && destination.droppableId === "page-canvas") {
      const reorderedElements = [...elements];
      const [removed] = reorderedElements.splice(source.index, 1);
      reorderedElements.splice(destination.index, 0, removed);
      
      setElements(reorderedElements);
      
      // Update content via callback
      if (onContentChange) {
        onContentChange("design_elements", reorderedElements);
      }
    }
  };

  // Render element preview based on type
  const renderElementPreview = (element: DesignElement) => {
    switch (element.type) {
      case "banner":
        return (
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="text-lg font-medium">{element.content.title}</h3>
            <p className="text-sm text-gray-600">{element.content.subtitle}</p>
            <div className="mt-2">
              <Button size="sm">{element.content.buttonText}</Button>
            </div>
          </div>
        );
      case "image":
        return (
          <div className="relative h-24 bg-gray-200 rounded-md flex items-center justify-center">
            <Image className="text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Resim</span>
          </div>
        );
      case "text":
        return (
          <div className="p-2 bg-gray-100 rounded-md">
            <p className="text-sm">{element.content.text}</p>
          </div>
        );
      case "button":
        return <Button size="sm">{element.content.text}</Button>;
      case "link":
        return <a className="text-blue-600 underline text-sm" href="#">{element.content.text}</a>;
      case "form":
        return (
          <div className="bg-gray-100 p-3 rounded-md">
            <h4 className="text-sm font-medium">{element.content.title}</h4>
            <div className="mt-2 h-8 bg-gray-200 rounded-sm"></div>
          </div>
        );
      case "survey":
        return (
          <div className="bg-gray-100 p-3 rounded-md">
            <h4 className="text-sm font-medium">{element.content.question}</h4>
            <div className="mt-2 space-y-1">
              {element.content.options.map((option: string, i: number) => (
                <div key={i} className="flex items-center">
                  <div className="h-3 w-3 rounded-full border border-gray-400 mr-2"></div>
                  <span className="text-xs">{option}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "container":
        return (
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-md min-h-16 flex items-center justify-center">
            <span className="text-xs text-gray-500">Konteyner</span>
          </div>
        );
      default:
        return <div>Bilinmeyen öğe</div>;
    }
  };

  // Remove element
  const handleRemoveElement = (id: string) => {
    const filteredElements = elements.filter(el => el.id !== id);
    setElements(filteredElements);
    
    // Update content via callback
    if (onContentChange) {
      onContentChange("design_elements", filteredElements);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">Sayfa Tasarım Seçenekleri</h3>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <ResizablePanelGroup direction="horizontal" className="min-h-[500px] border rounded-md">
            {/* Left panel - Available Elements */}
            <ResizablePanel defaultSize={25} minSize={20}>
              <div className="h-full p-3 border-r">
                <h4 className="font-medium text-sm flex items-center mb-3">
                  <PanelLeft className="mr-1" size={16} />
                  Elementler
                </h4>
                
                <Droppable droppableId="available-elements">
                  {(provided) => (
                    <div 
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {availableElements.map((element, index) => (
                        <Draggable 
                          key={element.id} 
                          draggableId={element.id} 
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors cursor-grab"
                            >
                              <div className="mr-2 text-gray-600">{element.icon}</div>
                              <span className="text-sm">{element.label}</span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Right panel - Page Canvas */}
            <ResizablePanel defaultSize={75}>
              <div className="h-full p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-sm flex items-center">
                    <Eye className="mr-1" size={16} />
                    Sayfa Önizleme
                  </h4>
                  <div className="flex items-center text-xs text-gray-500">
                    <MoveHorizontal size={14} className="mr-1" />
                    <span>Yeniden düzenlemek için sürükleyip bırakın</span>
                  </div>
                </div>
                
                <Droppable droppableId="page-canvas">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[400px] bg-white rounded-md border border-gray-200 p-4 space-y-3"
                    >
                      {elements.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-md py-16">
                          <p>Elementleri buraya sürükleyin</p>
                        </div>
                      ) : (
                        elements.map((element, index) => (
                          <Draggable 
                            key={element.id} 
                            draggableId={element.id} 
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="relative group"
                              >
                                <div className="bg-gray-50 rounded-md p-2 border border-gray-200 hover:border-gray-300">
                                  <div 
                                    {...provided.dragHandleProps}
                                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded p-1 cursor-grab"
                                  >
                                    <MoveHorizontal size={14} />
                                  </div>
                                  
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveElement(element.id)}
                                    className="absolute right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded p-1 text-red-500 hover:bg-red-50"
                                  >
                                    ✕
                                  </button>
                                  
                                  <div className="pt-4">
                                    {renderElementPreview(element)}
                                  </div>
                                  
                                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                                    {element.icon}
                                    <span className="ml-1">{element.label}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

export default DesignTab;
